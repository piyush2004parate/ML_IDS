import json
import datetime
import asyncio
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils.ml_classifier import AnomalyDetector
from .db_utils import save_traffic_and_incidents  # pyright: ignore[reportMissingImports]

# Scapy capture imports
from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP

# Instantiate the machine learning model ONCE when the server starts.
# This ensures we use the same trained model for all connections.
anomaly_detector = AnomalyDetector()

class TrafficConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        # Store the main event loop to use for sending messages back to the client
        self.main_loop = asyncio.get_running_loop()
        # Start the sniffing process in a separate, non-blocking thread
        self.task = self.main_loop.run_in_executor(None, self.sniff_packets)
        print("WebSocket connection accepted. Starting live packet capture (Scapy)...")

    async def disconnect(self, close_code):
        if self.task:
            self.task.cancel()
        print(f"WebSocket disconnected with code: {close_code}")

    def sniff_packets(self):
        # Create a new event loop for this background thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        print("Scapy packet sniffing thread started.")

        def handle_packet(pkt):
            try:
                if IP not in pkt:
                    return
                ip_layer = pkt[IP]

                if TCP in pkt:
                    protocol_str = "TCP"
                elif UDP in pkt:
                    protocol_str = "UDP"
                else:
                    protocol_str = "IP"

                # Length fallback: prefer IP header length, else raw bytes length
                try:
                    length_val = int(ip_layer.len)
                except Exception:
                    length_val = int(len(bytes(pkt)))

                features = {
                    "src_ip": ip_layer.src,
                    "dst_ip": ip_layer.dst,
                    "protocol": protocol_str,
                    "length": length_val,
                    "timestamp": datetime.datetime.now().timestamp(),
                }

                status, severity = anomaly_detector.classify_packet(features)

                data = {
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.datetime.now().isoformat(),
                    "source_ip": ip_layer.src,
                    "destination_ip": ip_layer.dst,
                    "protocol": protocol_str,
                    "bytes": length_val,
                    "status": status,
                    "severity": severity,
                }

                asyncio.run_coroutine_threadsafe(
                    self.send(text_data=json.dumps(data)), self.main_loop
                )
                asyncio.run_coroutine_threadsafe(
                    save_traffic_and_incidents(data), self.main_loop
                )
            except Exception as e:
                print(f"Error processing a Scapy packet: {e}")

        # Start Scapy sniffing (requires admin privileges and Npcap on Windows)
        sniff(filter="ip", prn=handle_packet, store=False)
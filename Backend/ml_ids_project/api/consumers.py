import json
import asyncio
import random
import uuid
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import NetworkTraffic
from .serializers import NetworkTrafficSerializer

class TrafficConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.traffic_generator_task = asyncio.create_task(self.send_live_traffic())
        print("WebSocket connected and live traffic simulation started.")

    async def disconnect(self, close_code):
        print("WebSocket disconnected")
        if hasattr(self, 'traffic_generator_task') and self.traffic_generator_task:
            self.traffic_generator_task.cancel()
            print("Traffic generation task cancelled.")

    @database_sync_to_async
    def save_traffic(self, traffic_data):
        print(f"--- Attempting to save data: {traffic_data}")
        serializer = NetworkTrafficSerializer(data=traffic_data)
        if serializer.is_valid():
            try:
                serializer.save()
                print("--- Data saved successfully!")
            except Exception as e:
                print(f"--- DATABASE SAVE FAILED: {e}")
        else:
            print("--- SERIALIZER INVALID:")
            print(serializer.errors)

    async def send_live_traffic(self):
        protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS']
        statuses = ['Normal', 'Anomalous', 'Blocked']
        severities = ['Low', 'Medium', 'High']

        while True:
            try:
                status = random.choice(statuses)
                severity = random.choice(severities) if status != 'Normal' else None

                traffic_data = {
                    'timestamp': timezone.now().isoformat(),
                    'source_ip': f"192.168.{random.randint(0, 255)}.{random.randint(0, 255)}",
                    'destination_ip': f"10.0.{random.randint(0, 255)}.{random.randint(0, 255)}",
                    'protocol': random.choice(protocols),
                    'bytes': random.randint(64, 10000),
                    'status': status,
                    'severity': severity,
                }
                
                print(f"Generated traffic: {traffic_data}")
                await self.save_traffic(traffic_data)

                # Prepare data for WebSocket
                traffic_data_ws = traffic_data.copy()
                traffic_data_ws['id'] = str(uuid.uuid4())
                await self.send(text_data=json.dumps(traffic_data_ws))

                await asyncio.sleep(1)

            except asyncio.CancelledError:
                print("send_live_traffic task was cancelled.")
                break
            except Exception as e:
                print(f"An error occurred in send_live_traffic: {e}")
                break

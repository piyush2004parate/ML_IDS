import json
import asyncio
import random
from datetime import datetime
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import NetworkTraffic
from .serializers import NetworkTrafficSerializer

class TrafficConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.traffic_generator_task = asyncio.create_task(self.send_live_traffic())
        print("WebSocket connected and live traffic simulation started.")

    async def disconnect(self, close_code):
        print("WebSocket disconnected")
        self.traffic_generator_task.cancel()

    async def send_live_traffic(self):
        protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS']
        statuses = ['Normal', 'Anomalous', 'Blocked']
        severities = ['Low', 'Medium', 'High', 'Critical']

        while True:
            source_ip = f"192.168.{random.randint(0, 255)}.{random.randint(0, 255)}"
            destination_ip = f"10.0.{random.randint(0, 255)}.{random.randint(0, 255)}"
            protocol = random.choice(protocols)
            bytes_sent = random.randint(64, 10000)
            status = random.choice(statuses)
            severity = random.choice(severities) if status != 'Normal' else None

            traffic_data = {
                'id': str(uuid.uuid4()),
                'timestamp': str(datetime.now()),
                'source_ip': source_ip,
                'destination_ip': destination_ip,
                'protocol': protocol,
                'bytes': bytes_sent,
                'status': status,
                'severity': severity,
            }

            await self.send(text_data=json.dumps(traffic_data))

            await asyncio.sleep(1)
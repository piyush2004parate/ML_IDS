from asgiref.sync import sync_to_async
from django.utils import timezone
from .models import NetworkTraffic, ThreatIncident


async def save_traffic_and_incidents(packet_data: dict) -> None:
	"""Persist live traffic to DB and create incident rows for anomalies.

	Args:
		packet_data: Dict with keys id, timestamp, source_ip, destination_ip, protocol, bytes, status, severity
	"""
	# Save traffic row
	traffic = await sync_to_async(NetworkTraffic.objects.create)(
		id=packet_data.get("id"),
		timestamp=timezone.now(),
		source_ip=packet_data.get("source_ip", ""),
		destination_ip=packet_data.get("destination_ip", ""),
		protocol=packet_data.get("protocol", ""),
		bytes=packet_data.get("bytes", 0),
		status=packet_data.get("status", "Normal"),
		severity=packet_data.get("severity"),
	)
	# If anomalous, record an incident
	status = packet_data.get("status", "Normal")
	if status in ("Anomalous", "Blocked"):
		threat_type = packet_data.get("protocol", "Unknown")
		severity = packet_data.get("severity", "Medium")
		description = f"Detected {status.lower()} traffic from {packet_data.get('source_ip')} to {packet_data.get('destination_ip')} via {packet_data.get('protocol')}"
		await sync_to_async(ThreatIncident.objects.create)(
			source_ip=packet_data.get("source_ip", ""),
			destination_ip=packet_data.get("destination_ip", ""),
			threat_type=threat_type,
			severity=severity,
			status="Open",
			description=description,
			confidence=80,
		)

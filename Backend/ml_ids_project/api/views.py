# api/views.py
from rest_framework import viewsets
from .models import NetworkTraffic, ThreatIncident, ResponseRule, LogEntry
from .serializers import (
    NetworkTrafficSerializer,
    ThreatIncidentSerializer,
    ResponseRuleSerializer,
    LogEntrySerializer,
)

class NetworkTrafficViewSet(viewsets.ModelViewSet):
    queryset = NetworkTraffic.objects.all()
    serializer_class = NetworkTrafficSerializer

class ThreatIncidentViewSet(viewsets.ModelViewSet):
    queryset = ThreatIncident.objects.all()
    serializer_class = ThreatIncidentSerializer

class ResponseRuleViewSet(viewsets.ModelViewSet):
    queryset = ResponseRule.objects.all()
    serializer_class = ResponseRuleSerializer

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
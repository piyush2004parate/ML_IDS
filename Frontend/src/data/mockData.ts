import { NetworkTraffic, ThreatIncident, SystemMetrics, ResponseRule, LogEntry } from '../types';

// Generate mock network traffic data
export const generateMockTraffic = (): NetworkTraffic[] => {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
  const statuses: ('Normal' | 'Anomalous' | 'Blocked')[] = ['Normal', 'Anomalous', 'Blocked'];
  const severities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `traffic-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    sourceIp: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    destinationIp: `10.0.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    bytes: Math.floor(Math.random() * 10000) + 64,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    severity: Math.random() > 0.7 ? severities[Math.floor(Math.random() * severities.length)] : undefined,
  }));
};

// Generate mock threat incidents
export const generateMockIncidents = (): ThreatIncident[] => {
  const threatTypes: ThreatIncident['threatType'][] = ['Malware', 'Phishing', 'Anomaly', 'Encrypted Threats', 'DDoS', 'Port Scan'];
  const severities: ThreatIncident['severity'][] = ['Low', 'Medium', 'High', 'Critical'];
  const statuses: ThreatIncident['status'][] = ['Active', 'Blocked', 'Investigating', 'Resolved', 'False Positive'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `incident-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    sourceIp: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    destinationIp: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: `Suspicious activity detected from source IP. Confidence level: ${Math.floor(Math.random() * 40) + 60}%`,
    confidence: Math.floor(Math.random() * 40) + 60,
  }));
};

// Mock system metrics
export const mockMetrics: SystemMetrics = {
  totalPackets: 1247832,
  activeThreats: 23,
  blockedIps: 156,
  falsePositives: 8,
};

// Mock response rules
export const mockResponseRules: ResponseRule[] = [
  {
    id: 'rule-1',
    name: 'High Severity Auto-Block',
    condition: 'Severity >= High AND Confidence >= 85%',
    action: 'Block IP',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    triggeredCount: 45,
  },
  {
    id: 'rule-2',
    name: 'Malware Detection',
    condition: 'ThreatType = Malware',
    action: 'Isolate Device',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    triggeredCount: 12,
  },
  {
    id: 'rule-3',
    name: 'DDoS Protection',
    condition: 'ThreatType = DDoS',
    action: 'Block IP',
    isActive: false,
    createdAt: new Date('2024-01-20'),
    triggeredCount: 3,
  },
];

// Mock log entries
export const mockLogs: LogEntry[] = Array.from({ length: 100 }, (_, i) => ({
  id: `log-${i}`,
  timestamp: new Date(Date.now() - Math.random() * 604800000), // Random time in last week
  action: ['Block IP', 'Isolate Device', 'Alert Sent', 'Rule Updated', 'Whitelist Added'][Math.floor(Math.random() * 5)],
  target: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
  result: Math.random() > 0.1 ? 'Success' : 'Failed',
  details: 'Automated response executed successfully',
  severity: ['Info', 'Warning', 'Error'][Math.floor(Math.random() * 3)] as 'Info' | 'Warning' | 'Error',
}));

// Generate chart data
export const generateTrafficChartData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    packets: Math.floor(Math.random() * 5000) + 1000,
    threats: Math.floor(Math.random() * 100) + 10,
  }));
};

export const generateProtocolData = () => [
  { name: 'TCP', value: 45, color: '#00f5ff' },
  { name: 'UDP', value: 30, color: '#39ff14' },
  { name: 'HTTP', value: 15, color: '#ff6b35' },
  { name: 'HTTPS', value: 8, color: '#ff1744' },
  { name: 'ICMP', value: 2, color: '#ffd700' },
];

export const generateThreatCategoryData = () => [
  { name: 'Malware', count: 45 },
  { name: 'Phishing', count: 32 },
  { name: 'Anomaly', count: 28 },
  { name: 'DDoS', count: 15 },
  { name: 'Port Scan', count: 12 },
  { name: 'Encrypted Threats', count: 8 },
];
export interface NetworkTraffic {
  id: string;
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  bytes: number;
  status: 'Normal' | 'Anomalous' | 'Blocked';
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ThreatIncident {
  id: string;
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  threatType: 'Malware' | 'Phishing' | 'Anomaly' | 'Encrypted Threats' | 'DDoS' | 'Port Scan';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Blocked' | 'Investigating' | 'Resolved' | 'False Positive';
  description: string;
  confidence: number;
}

export interface SystemMetrics {
  totalPackets: number;
  activeThreats: number;
  blockedIps: number;
  falsePositives: number;
}

export interface ResponseRule {
  id: string;
  name: string;
  condition: string;
  action: 'Block IP' | 'Isolate Device' | 'Alert Admin' | 'Quarantine';
  isActive: boolean;
  createdAt: Date;
  triggeredCount: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  target: string;
  result: 'Success' | 'Failed';
  details: string;
  severity: 'Info' | 'Warning' | 'Error';
}
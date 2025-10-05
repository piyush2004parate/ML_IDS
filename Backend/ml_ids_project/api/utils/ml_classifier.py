class AnomalyDetector:
    def __init__(self):
        # This is a placeholder for the actual anomaly detector
        pass

    def predict(self, data):
        # This is a placeholder for the prediction logic
        # For now, let's say it returns no anomaly
        return 0

    def classify_packet(self, features: dict):
        """Classify a packet using simple heuristics.

        Returns a tuple: (status, severity)
        status: 'Normal' | 'Anomalous' | 'Blocked'
        severity: 'Low' | 'Medium' | 'High' | 'Critical'
        """
        try:
            protocol = str(features.get("protocol", "")).upper()
            length = int(features.get("length", 0))

            # Simple heuristic rules; replace with real model inference later
            if length > 1200:
                return ("Anomalous", "High")
            if protocol in ("DNS", "ICMP") and length > 600:
                return ("Anomalous", "Medium")
            if protocol == "UDP" and length > 900:
                return ("Anomalous", "Medium")

            # Default normal
            return ("Normal", "Low")
        except Exception:
            # In case of any unexpected parsing errors, be conservative
            return ("Normal", "Low")

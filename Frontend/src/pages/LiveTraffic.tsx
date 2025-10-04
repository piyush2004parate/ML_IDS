import React, { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import { Play, Pause } from 'lucide-react';

interface NetworkTraffic {
  id: number;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  bytes: number;
  status: 'normal' | 'anomalous' | 'blocked';
  severity?: 'low' | 'medium' | 'high';
}

export const LiveTraffic: React.FC = () => {
  const [traffic, setTraffic] = useState<NetworkTraffic[]>([]);
  const { showToast } = useToast();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const ws = new WebSocket(`wss://${window.location.hostname.replace('5173', '8000')}/ws/traffic/`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      showToast('success', 'Live traffic feed connected');
    };

    ws.onmessage = (event) => {
      const newTraffic = JSON.parse(event.data);
      setTraffic((prevTraffic) => [newTraffic, ...prevTraffic]);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      showToast('error', 'Live traffic feed disconnected. Check the server and your network connection.');
    };

    return () => {
      ws.close();
    };
  }, [showToast, isPaused]);


  const getStatusBadge = (status: NetworkTraffic['status']) => {
    const colors = {
      normal: 'bg-green-500/20 text-green-400',
      anomalous: 'bg-yellow-500/20 text-yellow-400',
      blocked: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>{status}</span>;
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Live Network Traffic</h2>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          {isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />}
          {isPaused ? 'Resume Feed' : 'Pause Feed'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-2">Time</th>
              <th className="p-2">Source IP</th>
              <th className="p-2">Destination IP</th>
              <th className="p-2">Protocol</th>
              <th className="p-2">Bytes</th>
              <th className="p-2">Status</th>
              <th className="p-2">Severity</th>
            </tr>
          </thead>
          <tbody>
            {traffic.map((t) => (
              <tr key={t.id} className="border-b border-gray-800">
                <td className="p-2">{new Date(t.timestamp).toLocaleTimeString()}</td>
                <td className="p-2">{t.source_ip}</td>
                <td className="p-2">{t.destination_ip}</td>
                <td className="p-2">{t.protocol}</td>
                <td className="p-2">{t.bytes}</td>
                <td className="p-2">{getStatusBadge(t.status)}</td>
                <td className="p-2">{t.severity || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

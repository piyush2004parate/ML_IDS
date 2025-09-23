import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../components/UI/MetricCard';
import { Package, Shield, Ban, AlertTriangle } from 'lucide-react';
import { ThreatIncident, NetworkTraffic } from '../types';

type ProtocolDataItem = {
  name: string;
  value: number;
  color: string;
};

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalPackets: 0,
    activeThreats: 0,
    blockedIps: 0,
    falsePositives: 0,
  });
  const [trafficData, setTrafficData] = useState<{ hour: string; packets: number; threats: number }[]>([]);
  const [protocolData, setProtocolData] = useState<ProtocolDataItem[]>([]);
  const [threatData, setThreatData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const incidentsResponse = await axios.get<ThreatIncident[]>('http://127.0.0.1:8000/api/incidents/');
        const trafficResponse = await axios.get<NetworkTraffic[]>('http://127.0.0.1:8000/api/traffic/');
        
        const activeThreats = incidentsResponse.data.filter(i => i.status === 'Active').length;
        const blockedIps = incidentsResponse.data.filter(i => i.status === 'Blocked').length;
        const falsePositives = incidentsResponse.data.filter(i => i.status === 'False Positive').length;
        
        const protocolCounts = trafficResponse.data.reduce((acc: { [key: string]: number }, curr) => {
          acc[curr.protocol] = (acc[curr.protocol] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
        
        const threatCounts = incidentsResponse.data.reduce((acc: Record<string, number>, curr) => {
          acc[curr.threat_type] = (acc[curr.threat_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setMetrics({
          totalPackets: trafficResponse.data.length,
          activeThreats,
          blockedIps,
          falsePositives,
        });

        const protocols = Object.keys(protocolCounts).map(key => ({
          name: key,
          value: protocolCounts[key],
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
        }));
        setProtocolData(protocols);

        const threats = Object.keys(threatCounts).map(key => ({
          name: key,
          count: threatCounts[key],
        }));
        setThreatData(threats);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    
    // Simulate live traffic for the chart
    const generateTrafficData = () => {
        // You would fetch this from the API in a real scenario
        return Array.from({ length: 24 }, (_, i) => ({
          hour: `${i.toString().padStart(2, '0')}:00`,
          packets: Math.floor(Math.random() * 5000) + 1000,
          threats: Math.floor(Math.random() * 100) + 10,
        }));
    };
    
    setTrafficData(generateTrafficData());

    // Fetch data initially and then refresh periodically
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Packets"
          value={metrics.totalPackets.toLocaleString()}
          icon={Package}
          color="cyan"
        />
        <MetricCard
          title="Active Threats"
          value={metrics.activeThreats}
          icon={Shield}
          color="red"
        />
        <MetricCard
          title="Blocked IPs"
          value={metrics.blockedIps}
          icon={Ban}
          color="yellow"
        />
        <MetricCard
          title="False Positives"
          value={metrics.falsePositives}
          icon={AlertTriangle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Network Traffic (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line
                type="monotone"
                dataKey="packets"
                stroke="#00F5FF"
                strokeWidth={2}
                dot={{ fill: '#00F5FF', strokeWidth: 2, r: 4 }}
                name="Packets/sec"
              />
              <Line
                type="monotone"
                dataKey="threats"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                name="Threats"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Protocol Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={protocolData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {protocolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center mt-4 gap-4">
            {protocolData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Threat Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={threatData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Bar dataKey="count" fill="#00F5FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
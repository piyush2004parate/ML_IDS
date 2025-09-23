import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../components/UI/MetricCard';
import { Package, Shield, Ban, AlertTriangle } from 'lucide-react';
import { mockMetrics, generateTrafficChartData, generateProtocolData, generateThreatCategoryData } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const [trafficData, setTrafficData] = useState(generateTrafficChartData());
  const [protocolData] = useState(generateProtocolData());
  const [threatData] = useState(generateThreatCategoryData());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(generateTrafficChartData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Packets"
          value={mockMetrics.totalPackets}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          color="cyan"
        />
        <MetricCard
          title="Active Threats"
          value={mockMetrics.activeThreats}
          icon={Shield}
          trend={{ value: -8, isPositive: false }}
          color="red"
        />
        <MetricCard
          title="Blocked IPs"
          value={mockMetrics.blockedIps}
          icon={Ban}
          trend={{ value: 23, isPositive: true }}
          color="yellow"
        />
        <MetricCard
          title="False Positives"
          value={mockMetrics.falsePositives}
          icon={AlertTriangle}
          trend={{ value: -15, isPositive: true }}
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
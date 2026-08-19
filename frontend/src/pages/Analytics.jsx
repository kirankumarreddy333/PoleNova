import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import DemoController from '../components/DemoController.jsx';
import api from '../services/api.js';

const COLORS = ['#38bdf8', '#f97316', '#ef4444', '#22c55e', '#a855f7'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [faults, setFaults] = useState([]);
  
  const loadData = async () => {
    try {
      const res = await api.get('/faults?limit=100');
      setFaults(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const causeCounts = {};
  const severityCounts = { critical: 0, medium: 0, low: 0 };
  
  faults.forEach(f => {
    causeCounts[f.rootCause] = (causeCounts[f.rootCause] || 0) + 1;
    if (severityCounts[f.severity] !== undefined) severityCounts[f.severity]++;
  });

  const causeData = Object.keys(causeCounts).map(key => ({
    name: key.replace('_', ' '),
    value: causeCounts[key]
  }));

  const severityData = [
    { name: 'Critical', value: severityCounts.critical },
    { name: 'Medium', value: severityCounts.medium },
    { name: 'Low', value: severityCounts.low },
  ];

  return (
    <div className="min-h-screen bg-grid-dark">
      <Sidebar />
      <main className="ml-64 p-8">
        <DemoController />
        <Navbar title="Analytics" subtitle="Demo analytics based on simulated sensor data." />
        
        {loading ? (
          <div className="glass h-64 animate-pulse rounded-2xl mt-8"></div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <FiBarChart2 className="text-grid-blue" /> Fault Root Causes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={causeData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-45} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <FiBarChart2 className="text-grid-blue" /> Severity Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;

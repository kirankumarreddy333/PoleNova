import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiWifiOff,
  FiZap
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import DemoController from '../components/DemoController.jsx';
import NetworkVisualization from '../components/NetworkVisualization.jsx';
import api from '../services/api.js';
import { getSocket } from '../services/socket.js';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [overviewRes, trendsRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/trends?limit=20')
      ]);
      setOverview(overviewRes.data.data);
      setTrends(
        trendsRes.data.data.map((r) => ({
          time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          voltage: Math.round(r.voltage),
          current: Math.round(r.current),
          temperature: Math.round(r.temperature)
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const socket = getSocket();
    socket.emit('join:dashboard');
    socket.on('sensor:update', loadData);
    socket.on('fault:new', loadData);
    socket.on('network:reset', loadData);
    return () => {
      socket.off('sensor:update', loadData);
      socket.off('fault:new', loadData);
      socket.off('network:reset', loadData);
    };
  }, []);

  return (
    <div className="min-h-screen bg-grid-dark">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <Navbar title="Network Overview" subtitle="Live status of your distribution network" />
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-grid-green animate-pulse"></div>
            <span className="text-xs font-bold tracking-widest text-grid-green">LIVE</span>
          </div>
        </div>
        <DemoController />

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass h-28 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Poles" value={overview?.totalPoles ?? 0} icon={FiActivity} color="blue" />
              <StatCard label="Healthy Poles" value={overview?.healthyPoles ?? 0} icon={FiCheckCircle} color="green" />
              <StatCard label="Faulty Poles" value={overview?.faultyPoles ?? 0} icon={FiAlertTriangle} color="red" />
              <StatCard label="Offline Devices" value={overview?.offlinePoles ?? 0} icon={FiWifiOff} color="orange" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="glass col-span-1 rounded-2xl p-5 lg:col-span-2">
                <h3 className="mb-4 text-sm font-semibold text-slate-300">Voltage & Current Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="voltage" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="current" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-300">Network Health</h3>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-white/5">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-grid-green"
                      style={{
                        clipPath: `inset(0 ${100 - (overview?.networkHealthPercent ?? 0)}% 0 0)`
                      }}
                    />
                    <span className="text-2xl font-bold text-slate-100">
                      {overview?.networkHealthPercent ?? 0}%
                    </span>
                  </div>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    {overview?.openFaults ?? 0} open fault(s) · {overview?.todaysFaults ?? 0} detected today
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="glass rounded-2xl p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-300">Temperature Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass col-span-1 rounded-2xl p-5 lg:col-span-2">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <FiZap className="text-grid-orange" /> Recent Alerts
                </h3>
                <div className="space-y-3">
                  {overview?.recentAlerts?.length ? (
                    overview.recentAlerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            Fault between {alert.poleFrom?.poleNumber} → {alert.poleTo?.poleNumber}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            alert.severity === 'critical'
                              ? 'bg-red-500/10 text-red-400'
                              : alert.severity === 'medium'
                              ? 'bg-orange-500/10 text-orange-400'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No alerts yet. Run AI fault detection from the Faults page.</p>
                  )}
                </div>
              </div>
            </div>
            
            <NetworkVisualization />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

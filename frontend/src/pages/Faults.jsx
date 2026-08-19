import { useEffect, useState } from 'react';
import { FiCpu, FiCheck, FiTrash2, FiLoader } from 'react-icons/fi';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';
import { getSocket } from '../services/socket.js';

const severityStyles = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  low: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

const statusStyles = {
  open: 'bg-red-500/10 text-red-400',
  in_progress: 'bg-orange-500/10 text-orange-400',
  resolved: 'bg-grid-green/10 text-grid-green'
};

const Faults = () => {
  const [faults, setFaults] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState('');

  const loadFaults = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faults', { params: { status: statusFilter } });
      setFaults(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaults();
    const socket = getSocket();
    socket.on('fault:new', loadFaults);
    return () => socket.off('fault:new', loadFaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const runDetection = async () => {
    setDetecting(true);
    setMessage('');
    try {
      const res = await api.post('/faults/detect');
      setMessage(
        `AI scan complete: ${res.data.detected} anomaly candidate(s) found, ${res.data.created} new fault(s) created.`
      );
      loadFaults();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Detection failed');
    } finally {
      setDetecting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/faults/${id}`, { status });
      loadFaults();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update fault');
    }
  };

  const deleteFault = async (id) => {
    if (!confirm('Delete this fault record?')) return;
    try {
      await api.delete(`/faults/${id}`);
      loadFaults();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete fault');
    }
  };

  return (
    <div className="min-h-screen bg-grid-dark">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-6 flex items-center justify-between">
          <Navbar title="AI Fault Detection" subtitle="Faults detected by comparing adjacent pole readings" />
          <button
            onClick={runDetection}
            disabled={detecting}
            className="mb-8 flex items-center gap-2 rounded-lg bg-grid-blue px-4 py-2.5 text-sm font-semibold text-grid-dark hover:brightness-110 disabled:opacity-60"
          >
            {detecting ? <FiLoader className="animate-spin" /> : <FiCpu />}
            {detecting ? 'Analyzing...' : 'Run AI Detection'}
          </button>
        </div>

        {message && (
          <div className="glass mb-5 rounded-xl border border-grid-blue/20 px-4 py-3 text-sm text-slate-300">
            {message}
          </div>
        )}

        <div className="glass mb-5 flex items-center gap-3 rounded-2xl p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-grid-blue"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading faults...</p>
          ) : faults.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-slate-500">
              No faults found. Click "Run AI Detection" to scan the network.
            </div>
          ) : (
            faults.map((fault) => (
              <div key={fault._id} className={`glass rounded-2xl border p-5 ${severityStyles[fault.severity]}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Fault between {fault.poleFrom?.poleNumber} → {fault.poleTo?.poleNumber}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Detected {new Date(fault.createdAt).toLocaleString()} · Confidence {fault.confidence}%
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{fault.aiRecommendation}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${severityStyles[fault.severity]}`}>
                        {fault.severity} severity
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[fault.status]}`}>
                        {fault.status.replace('_', ' ')}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-slate-400">
                        {fault.rootCause.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {fault.status !== 'resolved' && (
                      <>
                        {fault.status === 'open' && (
                          <button
                            onClick={() => updateStatus(fault._id, 'in_progress')}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5"
                          >
                            Start Work
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(fault._id, 'resolved')}
                          className="flex items-center gap-1 rounded-lg bg-grid-green/10 px-3 py-1.5 text-xs font-medium text-grid-green hover:bg-grid-green/20"
                        >
                          <FiCheck /> Resolve
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteFault(fault._id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Faults;

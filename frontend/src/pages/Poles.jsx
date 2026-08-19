import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import PoleFormModal from '../components/PoleFormModal.jsx';
import DemoController from '../components/DemoController.jsx';
import api from '../services/api.js';

const statusStyles = {
  healthy: 'bg-grid-green/10 text-grid-green',
  warning: 'bg-grid-orange/10 text-grid-orange',
  fault: 'bg-grid-red/10 text-grid-red',
  offline: 'bg-slate-500/10 text-slate-400'
};

const Poles = () => {
  const [poles, setPoles] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPole, setEditingPole] = useState(null);

  const loadPoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/poles', { params: { search, status, page, limit: 8 } });
      setPoles(res.data.data);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page]);

  const handleSubmit = async (data) => {
    try {
      if (editingPole) {
        await api.put(`/poles/${editingPole._id}`, data);
      } else {
        await api.post('/poles', data);
      }
      setModalOpen(false);
      setEditingPole(null);
      loadPoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save pole');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this pole? This cannot be undone.')) return;
    try {
      await api.delete(`/poles/${id}`);
      loadPoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete pole');
    }
  };

  return (
    <div className="min-h-screen bg-grid-dark">
      <Sidebar />
      <main className="ml-64 p-8">
        <DemoController />
        <div className="mb-6 flex items-center justify-between">
          <Navbar title="Pole Management" subtitle="Add, edit, and monitor every pole in your network" />
          <button
            onClick={() => {
              setEditingPole(null);
              setModalOpen(true);
            }}
            className="mb-8 flex items-center gap-2 rounded-lg bg-grid-blue px-4 py-2.5 text-sm font-semibold text-grid-dark hover:brightness-110"
          >
            <FiPlus /> Add Pole
          </button>
        </div>

        <div className="glass mb-5 flex flex-wrap items-center gap-3 rounded-2xl p-4">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              placeholder="Search pole number, area, village..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-grid-blue"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-grid-blue"
          >
            <option value="">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="fault">Fault</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 bg-white/5 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Pole Number</th>
                <th className="px-5 py-3">Village</th>
                <th className="px-5 py-3">Feeder</th>
                <th className="px-5 py-3">Health Score</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Loading poles...
                  </td>
                </tr>
              ) : poles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No poles found.
                  </td>
                </tr>
              ) : (
                poles.map((pole) => (
                  <tr key={pole._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <Link to={`/poles/${pole._id}`} className="font-medium text-grid-blue hover:underline">
                        {pole.poleNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{pole.village}</td>
                    <td className="px-5 py-3 text-slate-400">{pole.feeder}</td>
                    <td className="px-5 py-3 text-slate-400">{pole.healthScore}%</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[pole.status]}`}>
                        {pole.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPole(pole);
                            setModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-grid-blue"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(pole._id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
            <p className="text-xs text-slate-500">
              Page {page} of {pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-slate-100 disabled:opacity-30"
              >
                <FiChevronLeft size={15} />
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-slate-100 disabled:opacity-30"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <PoleFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingPole(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingPole}
        />
      </main>
    </div>
  );
};

export default Poles;

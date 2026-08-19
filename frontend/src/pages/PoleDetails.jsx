import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiZap, FiThermometer, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';

const PoleDetails = () => {
  const { id } = useParams();
  const [pole, setPole] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [poleRes, historyRes] = await Promise.all([
          api.get(`/poles/${id}`),
          api.get(`/sensors/${id}?limit=30`)
        ]);
        setPole(poleRes.data.data);
        setHistory(
          historyRes.data.data
            .slice()
            .reverse()
            .map((r) => ({
              time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              voltage: Math.round(r.voltage),
              temperature: Math.round(r.temperature)
            }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-grid-dark">
      <Sidebar />
      <main className="ml-64 p-8">
        <Link to="/poles" className="mb-4 flex w-fit items-center gap-2 text-sm text-slate-400 hover:text-slate-100">
          <FiArrowLeft /> Back to Poles
        </Link>
        <Navbar title={loading ? 'Loading...' : pole?.poleNumber} subtitle={pole?.village} />

        {!loading && pole && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="glass rounded-2xl p-5">
                <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                  <FiZap /> Voltage
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-100">
                  {pole.latestSensor ? Math.round(pole.latestSensor.voltage) : '--'} V
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                  <FiActivity /> Current
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-100">
                  {pole.latestSensor ? pole.latestSensor.current.toFixed(1) : '--'} A
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                  <FiThermometer /> Temperature
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-100">
                  {pole.latestSensor ? Math.round(pole.latestSensor.temperature) : '--'} °C
                </p>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="flex items-center gap-2 text-xs uppercase text-slate-500">
                  <FiMapPin /> Location
                </p>
                <p className="mt-2 text-sm font-medium text-slate-100">
                  {pole.latitude?.toFixed(4)}, {pole.longitude?.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="glass mt-6 rounded-2xl p-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-300">Voltage History</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="voltage" stroke="#38bdf8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass mt-6 rounded-2xl p-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-300">Pole Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <Info label="Area" value={pole.area} />
                <Info label="Feeder" value={pole.feeder} />
                <Info label="Transformer" value={pole.transformer || '-'} />
                <Info label="Status" value={pole.status} />
                <Info label="Health Score" value={`${pole.healthScore}%`} />
                <Info label="Installed" value={new Date(pole.installationDate).toLocaleDateString()} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase text-slate-500">{label}</p>
    <p className="mt-1 font-medium capitalize text-slate-200">{value}</p>
  </div>
);

export default PoleDetails;

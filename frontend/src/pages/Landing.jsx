import { Link } from 'react-router-dom';
import { FiActivity, FiZap, FiCpu, FiAlertTriangle, FiEye } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-grid-dark text-slate-300">
      <nav className="border-b border-white/5 bg-grid-dark/80 px-8 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <FiZap className="text-2xl text-grid-blue" />
            <span className="text-xl font-bold text-slate-100">
              Pole<span className="text-gradient">Nova</span> AI
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="font-semibold text-slate-400 hover:text-white">
              Login
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg bg-grid-blue px-4 py-2 text-sm font-bold text-grid-dark hover:brightness-110"
            >
              Watch Live Demo
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-8 py-20">
        <div className="mb-20 text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            AI-powered <span className="text-gradient">fault intelligence</span>
            <br /> for rural electricity networks.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            Detect distribution faults between poles in real time, understand exactly why they happened, 
            and help field teams respond faster with explainable AI and IoT.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-grid-blue px-8 py-4 text-base font-bold text-grid-dark shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-all"
            >
              <FiEye /> Watch Live Demo
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiAlertTriangle size={80} />
            </div>
            <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3 text-orange-400">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">The Problem</h3>
            <p className="text-slate-400 leading-relaxed">
              Rural distribution networks are difficult to monitor. Operators often discover faults only after customers report outages or field technicians manually inspect infrastructure.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiActivity size={80} />
            </div>
            <div className="mb-4 inline-flex rounded-lg bg-grid-green/10 p-3 text-grid-green">
              <FiActivity className="text-2xl" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">The Solution</h3>
            <p className="text-slate-400 leading-relaxed">
              Low-cost IoT sensors paired with real-time monitoring and our proprietary explainable AI detection engine instantly flags anomalies between adjacent poles.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FiCpu size={80} />
            </div>
            <div className="mb-4 inline-flex rounded-lg bg-grid-blue/10 p-3 text-grid-blue">
              <FiCpu className="text-2xl" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">How It Works</h3>
            <ol className="list-decimal pl-4 text-slate-400 space-y-2">
              <li>Sensors collect real-time readings</li>
              <li>PoleNova monitors the digital twin</li>
              <li>AI detects adjacent-pole anomalies</li>
              <li>Operators receive explainable alerts</li>
              <li>Technicians investigate and resolve</li>
            </ol>
          </div>
        </div>

        <div className="mt-20 glass rounded-3xl p-10 md:p-16 border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-blue/5 blur-[120px] rounded-full pointer-events-none"></div>
          <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Built for Dora Hack 2.0</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8 relative z-10">
            PoleNova AI is not just a CRUD app. It is a decision-support, monitoring, and fault-intelligence platform built on the MERN stack with Socket.io for real-time telemetry.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold border border-slate-700">Real-time Visibility</span>
            <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold border border-slate-700">Explainable AI</span>
            <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold border border-slate-700">Faster Response</span>
            <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold border border-slate-700">Historical Analytics</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiCpu, FiMap, FiBarChart2, FiShield, FiArrowRight } from 'react-icons/fi';

const features = [
  { icon: FiCpu, title: 'AI Fault Detection', desc: 'Compares readings between adjacent poles to instantly localize faults on the line.' },
  { icon: FiZap, title: 'Real-Time Monitoring', desc: 'Live voltage, current, and temperature streamed from every pole via Socket.io.' },
  { icon: FiMap, title: 'Network Visualization', desc: 'See your entire distribution network health at a glance from one dashboard.' },
  { icon: FiBarChart2, title: 'Analytics & Reports', desc: 'Historical trends, fault analytics, and exportable reports for DISCOM teams.' },
  { icon: FiShield, title: 'Role-Based Access', desc: 'Super Admin, Admin, Engineer, and Technician roles with scoped permissions.' }
];

const steps = [
  { step: '01', title: 'IoT Sensors', desc: 'Low-cost sensors on each pole capture voltage, current, and temperature.' },
  { step: '02', title: 'Data Ingestion', desc: 'Readings stream into the platform via REST/Socket.io in real time.' },
  { step: '03', title: 'AI Analysis', desc: 'The AI engine compares adjacent poles to detect and localize faults.' },
  { step: '04', title: 'Instant Alerts', desc: 'Engineers get severity-ranked alerts with root cause & recommendations.' }
];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-grid-dark">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-16">
        <div className="flex items-center gap-2">
          <FiZap className="text-2xl text-grid-blue" />
          <span className="text-lg font-bold text-slate-100">
            Pole<span className="text-gradient">Nova</span> AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-grid-blue px-4 py-2 text-sm font-semibold text-grid-dark hover:brightness-110"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pb-24 pt-16 text-center md:px-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_60%)]" />
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-5 w-fit rounded-full border border-grid-blue/30 bg-grid-blue/10 px-4 py-1.5 text-xs font-medium text-grid-blue"
        >
          AI + IoT for Rural DISCOMs
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-slate-100 md:text-6xl"
        >
          Intelligent Distribution Network <span className="text-gradient">Monitoring System</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-slate-400 md:text-lg"
        >
          PoleNova AI detects faults between electric poles in real time using low-cost IoT
          sensors and an AI-driven analysis engine — built for rural electricity distribution companies.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-grid-blue px-6 py-3 font-semibold text-grid-dark shadow-glow hover:brightness-110"
          >
            Explore Dashboard <FiArrowRight />
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-200 hover:bg-white/5"
          >
            Live Demo
          </Link>
        </motion.div>

        {/* animated electric line */}
        <div className="relative mx-auto mt-16 h-24 max-w-3xl">
          <svg viewBox="0 0 800 100" className="h-full w-full">
            <motion.path
              d="M0,50 L120,50 L160,20 L200,80 L240,50 L800,50"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 md:px-16">
        <h2 className="text-center text-3xl font-bold text-slate-100">Platform Features</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-500">
          Everything a modern smart-grid monitoring platform needs, purpose-built for DISCOM operations.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-grid-blue/10 text-xl text-grid-blue">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 md:px-16">
        <h2 className="text-center text-3xl font-bold text-slate-100">How It Works</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          {steps.map(({ step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/5 p-6"
            >
              <span className="text-4xl font-extrabold text-white/5">{step}</span>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem statement */}
      <section className="px-6 py-20 md:px-16">
        <div className="glass mx-auto max-w-4xl rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-slate-100">The Problem</h2>
          <p className="mt-4 text-slate-400">
            Rural distribution networks often lack real-time visibility. Faults between poles can go
            undetected for hours, causing prolonged outages, revenue loss, and safety risks. Manual
            inspection is slow and reactive — PoleNova AI turns this into proactive, data-driven maintenance.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 md:px-16">
        <div className="glass mx-auto flex max-w-4xl flex-col items-center rounded-2xl p-10 text-center shadow-glow">
          <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">Ready to see your grid, live?</h2>
          <p className="mt-3 max-w-md text-slate-500">
            Create an account and explore the full monitoring dashboard in minutes.
          </p>
          <Link
            to="/register"
            className="mt-6 flex items-center gap-2 rounded-xl bg-grid-blue px-6 py-3 font-semibold text-grid-dark hover:brightness-110"
          >
            Get Started <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-600 md:px-16">
        © {new Date().getFullYear()} PoleNova AI — Final Year Project. Built with the MERN stack.
      </footer>
    </div>
  );
};

export default Landing;

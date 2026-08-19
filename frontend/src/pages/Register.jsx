import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'technician' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid-dark px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <FiZap className="text-2xl text-grid-blue" />
          <span className="text-lg font-bold text-slate-100">
            Pole<span className="text-gradient">Nova</span> AI
          </span>
        </div>

        <h2 className="mb-1 text-center text-xl font-bold text-slate-100">Create your account</h2>
        <p className="mb-6 text-center text-sm text-slate-500">Join the monitoring platform</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-grid-blue"
            />
          </div>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-grid-blue"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-grid-blue"
            />
          </div>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-sm text-slate-100 outline-none focus:border-grid-blue"
          >
            <option value="technician">Technician</option>
            <option value="engineer">Engineer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-grid-blue py-2.5 text-sm font-semibold text-grid-dark hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-grid-blue hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

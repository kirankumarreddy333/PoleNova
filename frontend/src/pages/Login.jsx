import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid-dark px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]" />
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

        <h2 className="mb-1 text-center text-xl font-bold text-slate-100">Welcome back</h2>
        <p className="mb-6 text-center text-sm text-slate-500">Sign in to access your dashboard</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-grid-blue"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-grid-blue py-2.5 text-sm font-semibold text-grid-dark hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-grid-blue hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-white/5 bg-white/5 p-3 text-xs text-slate-500">
          <p className="mb-1 font-medium text-slate-400">Demo credentials (after seeding):</p>
          <p>admin@polenova.ai / password123</p>
          <p>engineer@polenova.ai / password123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

import { Link } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-grid-dark px-4 text-center">
    <FiZap className="mb-4 text-4xl text-grid-blue" />
    <h1 className="text-5xl font-extrabold text-slate-100">404</h1>
    <p className="mt-3 text-slate-500">The page you're looking for doesn't exist.</p>
    <Link
      to="/"
      className="mt-6 rounded-lg bg-grid-blue px-5 py-2.5 text-sm font-semibold text-grid-dark hover:brightness-110"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFound;

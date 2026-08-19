import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiAlertTriangle, FiLogOut, FiPieChart, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiHome },
  { name: 'Network', path: '/poles', icon: FiMapPin },
  { name: 'Faults', path: '/faults', icon: FiAlertTriangle },
  { name: 'Analytics', path: '/analytics', icon: FiPieChart },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="glass fixed left-0 top-0 z-20 flex h-screen w-64 flex-col justify-between p-5">
      <div>
        <div className="mb-10 flex items-center gap-2 px-2">
          <FiZap className="text-2xl text-grid-blue" />
          <span className="text-lg font-bold">
            Pole<span className="text-gradient">Nova</span> AI
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ path, name, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                location.pathname === path
                  ? 'bg-grid-blue/10 text-grid-blue shadow-glow'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon className="text-lg" />
              {name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/5 pt-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-grid-blue/20 text-sm font-bold text-grid-blue">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-100">{user?.name}</p>
            <p className="truncate text-xs capitalize text-slate-500">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

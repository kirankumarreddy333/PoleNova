import LiveClock from './LiveClock.jsx';

const Navbar = ({ title, subtitle }) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <LiveClock />
    </div>
  );
};

export default Navbar;

import { useEffect, useState } from 'react';

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="text-right">
      <p className="text-sm font-semibold text-slate-100">
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="text-xs text-slate-500">
        {now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
    </div>
  );
};

export default LiveClock;

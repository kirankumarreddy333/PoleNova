import { useState, useEffect } from 'react';
import { FiActivity, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import { getSocket } from '../services/socket';

const NetworkVisualization = () => {
  const [poles, setPoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPoles = async () => {
    try {
      const res = await api.get('/poles?limit=100');
      // Sort by sequence index
      const sorted = res.data.data.sort((a, b) => a.sequenceIndex - b.sequenceIndex);
      setPoles(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoles();
    const socket = getSocket();
    socket.on('sensor:update', fetchPoles);
    socket.on('fault:new', fetchPoles);
    socket.on('network:reset', fetchPoles);
    return () => {
      socket.off('sensor:update', fetchPoles);
      socket.off('fault:new', fetchPoles);
      socket.off('network:reset', fetchPoles);
    };
  }, []);

  if (loading) return <div className="glass h-48 animate-pulse rounded-2xl"></div>;

  // Group by feeder
  const feeders = {};
  poles.forEach(p => {
    if (!feeders[p.feeder]) feeders[p.feeder] = [];
    feeders[p.feeder].push(p);
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-grid-green shadow-[0_0_15px_rgba(34,197,94,0.5)]';
      case 'warning': return 'bg-grid-orange shadow-[0_0_15px_rgba(249,115,22,0.5)]';
      case 'fault': return 'bg-grid-red shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getLineColor = (current, next) => {
    if (current.status === 'fault' && next.status === 'fault') return 'bg-grid-red animate-pulse';
    if (current.status === 'fault' || next.status === 'fault') return 'bg-grid-red animate-pulse';
    if (current.status === 'offline' || next.status === 'offline') return 'bg-slate-700';
    return 'bg-grid-green/30';
  };

  return (
    <div className="glass mt-6 rounded-2xl p-6">
      <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-300">
        <FiActivity className="text-grid-blue" /> Network Digital Twin (Feeder Topology)
      </h3>
      
      <div className="space-y-8 overflow-x-auto pb-4">
        {Object.entries(feeders).map(([feederName, feederPoles]) => (
          <div key={feederName} className="min-w-[800px]">
            <h4 className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{feederName}</h4>
            <div className="flex items-center">
              <div className="flex flex-col items-center justify-center h-12 w-16 bg-slate-800 rounded-lg border border-slate-700 mr-2 z-10">
                <span className="text-[10px] font-bold text-slate-400">SOURCE</span>
              </div>
              
              <div className="h-1 w-8 bg-grid-green/30 relative"></div>
              
              {feederPoles.map((pole, idx) => {
                const nextPole = feederPoles[idx + 1];
                return (
                  <div key={pole._id} className="flex items-center">
                    <div className="relative group cursor-pointer">
                      <div className={`h-4 w-4 rounded-full ${getStatusColor(pole.status)} relative z-10 transition-all duration-300 transform group-hover:scale-150`}></div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-slate-400 group-hover:text-slate-200">
                        {pole.poleNumber}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-20 shadow-lg border border-slate-700">
                        {pole.status.toUpperCase()}
                      </div>
                    </div>
                    
                    {nextPole && (
                      <div className="relative flex items-center w-16 md:w-24 lg:w-32">
                        <div className={`h-1 w-full transition-colors duration-500 ${getLineColor(pole, nextPole)}`}></div>
                        {(pole.status === 'fault' || nextPole.status === 'fault') && (
                          <div className="absolute -top-6 w-full text-center text-[9px] font-bold text-grid-red animate-pulse">
                            FAULT SECTION
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkVisualization;

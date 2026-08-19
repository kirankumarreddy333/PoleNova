import { useState, useEffect } from 'react';
import { FiPlay, FiSquare, FiRefreshCw, FiZap, FiActivity } from 'react-icons/fi';
import api from '../services/api';

const DemoController = () => {
  const [status, setStatus] = useState({ isRunning: false, scenario: 'normal' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/simulation/status');
      setStatus(res.data.status);
    } catch (err) {
      console.error('Failed to fetch simulation status');
    }
  };

  const startSim = async () => {
    setLoading(true);
    await api.post('/simulation/start');
    await fetchStatus();
    setLoading(false);
  };

  const stopSim = async () => {
    setLoading(true);
    await api.post('/simulation/stop');
    await fetchStatus();
    setLoading(false);
  };

  const changeScenario = async (scenario) => {
    setLoading(true);
    await api.post('/simulation/scenario', { scenario });
    await fetchStatus();
    setLoading(false);
  };

  const resetNetwork = async () => {
    setLoading(true);
    await api.post('/simulation/reset');
    await fetchStatus();
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-grid-blue/30 bg-slate-900/90 p-4 shadow-2xl shadow-grid-blue/10 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <FiActivity className={status.isRunning ? 'text-grid-green animate-pulse' : 'text-slate-500'} />
          Hackathon Demo Mode
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${status.isRunning ? 'bg-grid-green/20 text-grid-green' : 'bg-slate-800 text-slate-400'}`}>
          {status.isRunning ? 'LIVE' : 'STOPPED'}
        </span>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {!status.isRunning ? (
            <button onClick={startSim} disabled={loading} className="flex-1 rounded-lg bg-grid-green/20 py-2 text-xs font-semibold text-grid-green hover:bg-grid-green/30 disabled:opacity-50">
              <FiPlay className="inline mr-1" /> Start
            </button>
          ) : (
            <button onClick={stopSim} disabled={loading} className="flex-1 rounded-lg bg-red-500/20 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/30 disabled:opacity-50">
              <FiSquare className="inline mr-1" /> Stop
            </button>
          )}
          <button onClick={resetNetwork} disabled={loading} className="flex-1 rounded-lg bg-slate-800 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50">
            <FiRefreshCw className="inline mr-1" /> Reset
          </button>
        </div>
        
        <div className="mt-2 text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Scenarios</div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => changeScenario('normal')} 
            className={`rounded-lg py-2 text-xs font-medium ${status.scenario === 'normal' ? 'bg-grid-blue/20 text-grid-blue border border-grid-blue/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Normal
          </button>
          <button 
            onClick={() => changeScenario('broken_wire')} 
            className={`rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1 ${status.scenario === 'broken_wire' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <FiZap /> Broken Wire
          </button>
          <button 
            onClick={() => changeScenario('transformer_overheating')} 
            className={`rounded-lg py-2 text-xs font-medium ${status.scenario === 'transformer_overheating' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Overheat
          </button>
          <button 
            onClick={() => changeScenario('voltage_instability')} 
            className={`rounded-lg py-2 text-xs font-medium ${status.scenario === 'voltage_instability' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Instability
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoController;

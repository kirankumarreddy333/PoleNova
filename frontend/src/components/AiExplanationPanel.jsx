import { FiCpu, FiAlertTriangle, FiInfo, FiCheck } from 'react-icons/fi';

const AiExplanationPanel = ({ fault }) => {
  return (
    <div className="mt-4 rounded-xl border border-grid-blue/20 bg-grid-dark p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-bold text-grid-blue">
          <FiCpu /> AI Fault Intelligence
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Confidence Score:</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <div 
                className={`h-full ${fault.confidence >= 80 ? 'bg-grid-green' : fault.confidence >= 60 ? 'bg-orange-400' : 'bg-red-500'}`} 
                style={{ width: `${fault.confidence}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-200">{fault.confidence}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Why was this flagged?</h5>
          <ul className="space-y-2">
            {fault.evidence && fault.evidence.length > 0 ? (
              fault.evidence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 text-grid-blue"><FiInfo size={14} /></span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-0.5 text-grid-blue"><FiInfo size={14} /></span>
                <span>Voltage drop analysis triggered the alert.</span>
              </li>
            )}
          </ul>
        </div>
        
        <div>
          <div className="mb-4">
            <h5 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Probable Cause</h5>
            <p className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <FiAlertTriangle className="text-orange-400" />
              {fault.rootCause.replace('_', ' ')}
            </p>
          </div>
          <div>
            <h5 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Action</h5>
            <p className="text-sm text-slate-300">
              {fault.aiRecommendation || 'Investigate section immediately.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiExplanationPanel;

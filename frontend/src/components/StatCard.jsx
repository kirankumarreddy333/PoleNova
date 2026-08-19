import { motion } from 'framer-motion';

const colorMap = {
  blue: 'text-grid-blue bg-grid-blue/10',
  green: 'text-grid-green bg-grid-green/10',
  orange: 'text-grid-orange bg-grid-orange/10',
  red: 'text-grid-red bg-grid-red/10'
};

const StatCard = ({ label, value, icon: Icon, color = 'blue', suffix = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-5 hover:shadow-glow transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100">
            {value}
            {suffix}
          </p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colorMap[color]}`}>
            <Icon />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;

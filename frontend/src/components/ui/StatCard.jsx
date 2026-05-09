import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass rounded-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className="text-green-400 text-sm mt-1">{trend}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
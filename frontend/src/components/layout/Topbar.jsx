import { motion } from 'framer-motion';

const Topbar = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-dark-200 glass border-b border-gray-700 flex items-center justify-between px-6"
    >
      <div className="flex items-center space-x-4">
        <h2 className="text-white font-semibold">Brain Tumor Analysis System</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">AI Engine Active</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-white text-sm font-medium">𝓐ryan 𝓢engar</p>
          <p className="text-gray-400 text-xs">AI & Deep Learning Developer</p>
        </div>
        <div className="w-10 h-10 bg-black border border-slate-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">𒅒</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;
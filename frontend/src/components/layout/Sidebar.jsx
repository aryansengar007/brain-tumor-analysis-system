import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/analyze', icon: '🔍', label: 'Scan Analysis' },
    { path: '/batch', icon: '📦', label: 'Multi-Scan Analysis' },
    { path: '/history', icon: '📋', label: 'Prediction Records' },
    { path: '/qr', icon: '📱', label: 'Share App' },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-dark-200 h-full glass border-r border-gray-700"
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className="w-10 h-10 bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">𖡎</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Brain Vision</h1>
            <p className="text-gray-400 text-xs">AI Analysis System</p>
          </div>
        </motion.div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <div className="glass rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">𓆩༺✧༻𓆪</div>
          <p className="text-xs text-gray-400">Developed by</p>
          <p className="text-xs text-gray-500">𝓐ryan 𝓢engar</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
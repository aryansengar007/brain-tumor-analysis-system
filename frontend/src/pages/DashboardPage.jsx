import { motion } from 'framer-motion';
import StatCard from '../components/ui/StatCard';

const DashboardPage = () => {
  // Mock data - in real app, fetch from API
  const stats = {
    totalScans: 1247,
    tumorDetected: 23.5,
    avgConfidence: 87.3,
    recentScans: 12
  };

  const recentActivity = [
    { id: 1, type: 'Tumor Detected', confidence: 92.4, time: '2 hours ago' },
    { id: 2, type: 'Healthy', confidence: 98.1, time: '4 hours ago' },
    { id: 3, type: 'Tumor Detected', confidence: 85.7, time: '6 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Advanced AI-Based Tumor Detection & Classification Platform</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Scans"
          value={stats.totalScans}
          icon="📊"
          trend="+12%"
        />
        <StatCard
          title="Tumor Detection Rate"
          value={`${stats.tumorDetected}%`}
          icon="🎯"
          trend="+2.1%"
        />
        <StatCard
          title="Avg Confidence"
          value={`${stats.avgConfidence}%`}
          icon="⚡"
          trend="+5.2%"
        />
        <StatCard
          title="Recent Scans"
          value={stats.recentScans}
          icon="🕒"
          trend="Today"
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-dark-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'Tumor Detected' ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-white font-medium">{activity.type}</p>
                  <p className="text-gray-400 text-sm">Confidence: {activity.confidence}%</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
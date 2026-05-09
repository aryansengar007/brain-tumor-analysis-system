import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ResultPanel = ({ results, onDownloadReport }) => {
  const { binary, type, segmentation, size_category } = results;
  const isTumorDetected = binary?.result === 'Tumor';

  const probabilityData = type?.probabilities ? 
    Object.entries(type.probabilities).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      probability: value * 100
    })) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Binary Classification */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Binary Classification</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-2xl font-bold flex items-center gap-2 ${
              isTumorDetected ? 'text-red-400' : 'text-green-400'
            }`}>
              {isTumorDetected ? '⚠️ Tumor' : '✓ Healthy'}
            </p>
            <p className="text-gray-400">Detection Result</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-400">
              {(binary?.confidence * 100).toFixed(1)}%
            </div>
            <p className="text-gray-400">Confidence</p>
          </div>
        </div>
        
        {/* Confidence Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Confidence</span>
            <span>{(binary?.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-dark-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${binary?.confidence * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full ${
                isTumorDetected ? 'bg-red-500' : 'bg-green-500'
              }`}
            />
          </div>
        </div>

        {/* Healthy message */}
        {!isTumorDetected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <p className="text-green-400 text-sm font-medium">
              ✓ No tumor detected — Brain scan appears normal
            </p>
          </motion.div>
        )}
      </div>

      {/* Tumor Type (only if tumor detected) */}
      {isTumorDetected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Tumor Type Classification</h3>
          
          <div className="mb-4">
            <p className="text-2xl font-bold text-blue-400">{type?.result}</p>
            <p className="text-gray-400">Predicted Type</p>
          </div>

          {/* Probability Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={probabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="probability" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Segmentation (only if tumor detected) */}
      {isTumorDetected && segmentation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Tumor Segmentation Analysis</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-purple-400">
                {segmentation?.tumor_area_percent?.toFixed(1)}%
              </p>
              <p className="text-gray-400">Tumor Area</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">{size_category}</p>
              <p className="text-gray-400">Size Category</p>
            </div>
          </div>

          {/* Segmentation Mask Preview */}
          {segmentation?.mask && (
            <div className="mt-4">
              <p className="text-gray-400 mb-2">Segmentation Mask</p>
              <img
                src={`data:image/png;base64,${segmentation.mask}`}
                alt="Segmentation mask"
                className="w-full h-32 object-contain rounded-lg bg-dark-200"
              />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <p className="text-orange-400 text-sm font-medium">
              ⚠️ Tumor detected — Detailed segmentation analysis shows affected areas
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Generate Medical Report */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isTumorDetected ? 0.6 : 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDownloadReport}
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
      >
        📄 Generate Medical Report
      </motion.button>
    </motion.div>
  );
};

export default ResultPanel;
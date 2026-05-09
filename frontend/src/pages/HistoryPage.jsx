import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('brainAnalysisHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('brainAnalysisHistory');
    toast.success('History cleared!');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analysis History</h1>
          <p className="text-gray-400">View previous brain scan analyses</p>
        </div>
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear History
          </motion.button>
        )}
      </motion.div>

      {history.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{item.fileName}</h3>
                <span className="text-gray-400 text-sm">{formatDate(item.timestamp)}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Binary Classification</h4>
                  <p className={`text-lg font-semibold ${
                    item.binary?.result === 'Tumor' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {item.binary?.result}
                  </p>
                  <p className="text-sm text-gray-400">
                    Confidence: {(item.binary?.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="bg-dark-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Tumor Type</h4>
                  <p className="text-lg font-semibold text-blue-400">{item.type?.result}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.type?.probabilities && (
                      <div className="space-y-1">
                        {Object.entries(item.type.probabilities).map(([type, prob]) => (
                          <div key={type} className="flex justify-between">
                            <span>{type}:</span>
                            <span>{(prob * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-dark-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Segmentation</h4>
                  <p className="text-lg font-semibold text-purple-400">
                    {item.segmentation?.tumor_area_percent?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-400">
                    Size: {item.size_category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-12 text-center"
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Analysis History</h3>
          <p className="text-gray-400">Your previous analyses will appear here</p>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryPage;
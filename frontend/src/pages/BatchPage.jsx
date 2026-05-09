import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DropZone from '../components/ui/DropZone';
import { predictFull } from '../services/api';

const BatchPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilesSelect = (files) => {
    setSelectedFiles(files);
    setResults([]);
  };

  const handleBatchAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images first');
      return;
    }

    setLoading(true);
    const batchResults = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        toast.loading(`Analyzing ${file.name}...`, { id: `analyze-${i}` });

        try {
          const result = await predictFull(file);
          batchResults.push({
            fileName: file.name,
            ...result,
            timestamp: new Date().toISOString()
          });
          toast.success(`${file.name} analyzed successfully!`, { id: `analyze-${i}` });
        } catch (error) {
          batchResults.push({
            fileName: file.name,
            error: 'Analysis failed',
            timestamp: new Date().toISOString()
          });
          toast.error(`${file.name} analysis failed`, { id: `analyze-${i}` });
        }
      }

      setResults(batchResults);
      toast.success('Batch analysis completed!');
    } catch (error) {
      toast.error('Batch analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) return;

    const csvData = results.map(result => ({
      'File Name': result.fileName,
      'Binary Result': result.binary?.result || 'N/A',
      'Binary Confidence': result.binary?.confidence || 'N/A',
      'Tumor Type': result.type?.result || 'N/A',
      'Glioma Prob': result.type?.probabilities?.glioma || 'N/A',
      'Meningioma Prob': result.type?.probabilities?.meningioma || 'N/A',
      'Pituitary Prob': result.type?.probabilities?.pituitary || 'N/A',
      'Notumor Prob': result.type?.probabilities?.notumor || 'N/A',
      'Tumor Area %': result.segmentation?.tumor_area_percent || 'N/A',
      'Size Category': result.size_category || 'N/A',
      'Timestamp': result.timestamp
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-analysis-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Batch Analysis</h1>
        <p className="text-gray-400">Analyze multiple brain scan images at once</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <DropZone
            onFileSelect={handleFilesSelect}
            multiple={true}
            accept="image/*"
          />

          {selectedFiles.length > 0 && (
            <div className="glass rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-dark-200 rounded">
                    <span className="text-gray-300 text-sm">{file.name}</span>
                    <span className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBatchAnalyze}
            disabled={selectedFiles.length === 0 || loading}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Analyzing...' : `Analyze ${selectedFiles.length} Images`}
          </motion.button>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Results</h3>
            {results.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCSV}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600 transition-colors"
              >
                Download CSV
              </motion.button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left text-gray-300 py-2">File</th>
                    <th className="text-left text-gray-300 py-2">Result</th>
                    <th className="text-left text-gray-300 py-2">Confidence</th>
                    <th className="text-left text-gray-300 py-2">Type</th>
                    <th className="text-left text-gray-300 py-2">Area %</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 text-white">{result.fileName}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.binary?.result === 'Tumor' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {result.binary?.result || 'Error'}
                        </span>
                      </td>
                      <td className="py-2 text-gray-300">
                        {result.binary?.confidence ? `${(result.binary.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="py-2 text-gray-300">{result.type?.result || 'N/A'}</td>
                      <td className="py-2 text-gray-300">
                        {result.segmentation?.tumor_area_percent ? `${result.segmentation.tumor_area_percent.toFixed(1)}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-4">📊</div>
              <p>Upload and analyze images to see results</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BatchPage;
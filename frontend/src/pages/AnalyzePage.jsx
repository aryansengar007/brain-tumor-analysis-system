import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DropZone from '../components/ui/DropZone';
import ResultPanel from '../components/ui/ResultPanel';
import { predictFull, generateReport } from '../services/api';

const AnalyzePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    gender: ''
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const result = await predictFull(selectedFile);
      setResults(result);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;

    // Validate patient details
    if (!patientDetails.name || !patientDetails.age || !patientDetails.gender) {
      toast.error('Please fill in all patient details before generating the report');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        patient_name: patientDetails.name,
        age: parseInt(patientDetails.age),
        gender: patientDetails.gender,
        scan_type: "MRI",
        image_filename: selectedFile?.name || "brain_scan.png",
        original_image: imagePreview,
        result: results.binary?.result || "Unknown",
        confidence: results.binary?.confidence || 0,
        tumor_type: results.type?.result || null,
        probabilities: results.type?.probabilities || null,
        tumor_area: results.segmentation?.area || null,
        size_category: results.size_category || null,
        segmentation_mask: results.segmentation?.mask ? `data:image/png;base64,${results.segmentation.mask}` : null
      };

      const pdfBlob = await generateReport(reportData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-report-${patientDetails.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Medical report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analyze Image</h1>
        <p className="text-gray-400">Upload a brain scan image for AI-powered analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Upload and Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <DropZone onFileSelect={handleFileSelect} />

          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Original Image</h3>
              <img
                src={imagePreview}
                alt="Original scan"
                className="w-full h-64 object-contain rounded-lg bg-dark-200"
              />
            </motion.div>
          )}

          {/* Patient Details Form */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Patient Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={patientDetails.age}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={patientDetails.gender}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </motion.button>
        </motion.div>

        {/* Right Panel - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {results ? (
            <ResultPanel
              results={results}
              onDownloadReport={handleDownloadReport}
            />
          ) : (
            <div className="glass rounded-lg p-6 h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">𖡎</div>
                <p className="text-lg">Upload an image to see analysis results</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzePage;
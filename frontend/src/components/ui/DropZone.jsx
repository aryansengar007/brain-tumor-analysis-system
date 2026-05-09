import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const DropZone = ({ onFileSelect, multiple = false, accept = "image/*" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (multiple) {
      onFileSelect(files);
    } else {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      onFileSelect(files);
    } else {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragOver ? 'border-primary-500 bg-primary-500/10' : 'border-gray-600'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      
      <motion.div
        animate={{ y: isDragOver ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="space-y-4"
      >
        <div className="text-6xl mb-4">
          {isDragOver ? '📂' : '🖼️'}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {multiple ? 'Drop multiple images here' : 'Drop your image here'}
          </h3>
          <p className="text-gray-400">
            or <span className="text-primary-400 hover:text-primary-300">browse files</span>
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Supports: JPG, PNG, DICOM images
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DropZone;
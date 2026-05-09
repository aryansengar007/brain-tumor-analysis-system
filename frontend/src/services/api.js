import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const predictBinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/predict/binary', formData);
  return response.data;
};

export const predictType = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/predict/type', formData);
  return response.data;
};

export const predictSegmentation = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/predict/segmentation', formData);
  return response.data;
};

export const predictFull = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/predict/full', formData);
  
  // Save to history
  const historyItem = {
    fileName: file.name,
    ...response.data,
    timestamp: new Date().toISOString()
  };
  
  const existingHistory = JSON.parse(localStorage.getItem('brainAnalysisHistory') || '[]');
  existingHistory.unshift(historyItem);
  localStorage.setItem('brainAnalysisHistory', JSON.stringify(existingHistory.slice(0, 50))); // Keep last 50
  
  return response.data;
};

export const generateReport = async (reportData) => {
  const response = await axios.post(`${API_BASE_URL}/generate-report`, reportData, {
    responseType: 'blob', // Important for downloading files
  });
  return response.data;
};
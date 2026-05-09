import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

const QRPage = () => {
  const [appUrl, setAppUrl] = useState('');
  const [manualIp, setManualIp] = useState('');
  const [backendError, setBackendError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLocalIp = async () => {
      try {
        const response = await fetch('http://localhost:8000/get-local-ip');
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }
        const data = await response.json();

        if (!data.ip || data.ip === 'localhost' || data.ip.startsWith('127.')) {
          throw new Error('Backend did not return a valid local network IP');
        }

        const url = `http://${data.ip}:${data.port}`;
        setAppUrl(url);
        setBackendError('');
      } catch (error) {
        console.error('Unable to fetch local IP from backend:', error);
        setBackendError('Unable to detect local IP automatically. Please enter it below.');
      }
    };

    fetchLocalIp();
  }, []);

  const handleCopyUrl = () => {
    const currentUrl = appUrl || (manualIp ? `http://${manualIp}:5173` : '');
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayedUrl = appUrl || (manualIp ? `http://${manualIp}:5173` : '');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Share App</h1>
        <p className="text-gray-400">Scan QR code to access the application on mobile</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center space-y-6"
      >
        {displayedUrl && (
          <>
            <div className="glass rounded-lg p-8">
              <QRCode
                value={displayedUrl}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                bgColor="#1f2937"
                fgColor="#ffffff"
              />
            </div>

            <div className="text-center space-y-3">
              <div>
                <p className="text-gray-300 mb-2 text-sm">Application URL:</p>
                <div className="flex items-center gap-2 justify-center">
                  <p className="text-white font-mono bg-dark-200 px-4 py-2 rounded-lg text-sm break-all">
                    {displayedUrl}
                  </p>
                  <button
                    onClick={handleCopyUrl}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 text-sm font-medium mb-2">📱 Mobile Access:</p>
                <p className="text-gray-300 text-sm">
                  Scan the QR code or open this URL on a mobile device connected to the same WiFi.
                </p>
              </div>
            </div>

            <div className="text-center text-gray-400 max-w-md">
              <p className="mb-4 text-sm">
                Share this QR code with colleagues or patients to provide easy access
                to the Brain Tumor Analysis system.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full">
                  AI-Powered
                </span>
                <span className="bg-secondary-500/20 text-secondary-400 px-3 py-1 rounded-full">
                  Medical Imaging
                </span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  Fast Analysis
                </span>
              </div>
            </div>
          </>
        )}

        {!displayedUrl && !backendError && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400"
          >
            <p>Detecting local network IP...</p>
          </motion.div>
        )}

        {backendError && (
          <div className="glass rounded-lg p-6 w-full max-w-lg">
            <p className="text-yellow-300 mb-3 font-medium">{backendError}</p>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter your local IP manually
            </label>
            <input
              type="text"
              value={manualIp}
              onChange={(e) => setManualIp(e.target.value)}
              placeholder="e.g. 192.168.1.100"
              className="w-full px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {manualIp && (
              <p className="mt-3 text-sm text-gray-300">
                QR code will use: <span className="font-mono">http://{manualIp}:5173</span>
              </p>
            )}
          </div>
        )}
      </motion.div>

      <div className="glass rounded-lg p-6 text-gray-300 max-w-2xl">
        <h2 className="text-lg font-semibold text-white mb-3">Mobile Access Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm leading-6">
          <li>Run frontend using: <span className="font-mono">npm run dev -- --host</span></li>
          <li>Ensure both your computer and mobile device are connected to the same WiFi network</li>
          <li>Scan the QR code or open the displayed URL on mobile</li>
        </ol>
      </div>
    </div>
  );
};

export default QRPage;
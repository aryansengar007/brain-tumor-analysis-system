import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import BatchPage from './pages/BatchPage';
import HistoryPage from './pages/HistoryPage';
import QRPage from './pages/QRPage';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-dark-300">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Topbar />

          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/batch" element={<BatchPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/qr" element={<QRPage />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-4 right-5 text-xs tracking-wide text-slate-400 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 shadow-lg z-50">
        © 2026 Aryan Sengar | Brain Tumor Analysis System
      </footer>

      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
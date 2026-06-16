import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResumeUpload from './components/ResumeUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import CandidateDatabase from './components/CandidateDatabase';
import { CheckCircle2 } from 'lucide-react';
import './App.css';

function MainApp() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [analysisData, setAnalysisData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSaveSuccess = (message) => {
    showToast(message);
    setAnalysisData(null); // Reset analysis dashboard after saving
    setActiveTab('database'); // Go to Talent Pool
  };

  const handleReset = () => {
    setAnalysisData(null);
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'analyze' ? (
        <>
          {!analysisData ? (
            <>
              <Hero />
              <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
            </>
          ) : (
            <AnalysisDashboard 
              analysisData={analysisData} 
              onSaveSuccess={handleSaveSuccess} 
              onReset={handleReset} 
            />
          )}
        </>
      ) : (
        <CandidateDatabase />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          <span className="toast-message">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

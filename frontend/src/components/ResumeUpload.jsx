import React, { useState, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function ResumeUpload({ onAnalysisComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const processFile = async (file) => {
    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file only.');
      return;
    }
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // POST to the fast-api server through Vite proxy
      const response = await fetch('/ml/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please check the backend connection.');
      }

      const data = await response.json();
      
      // Parse AI analysis content which is a JSON string
      let parsedAnalysis;
      try {
        // Remove markdown wrappers if any
        let cleanText = data.ai_analysis.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7, cleanText.length - 3);
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.substring(3, cleanText.length - 3);
        }
        parsedAnalysis = JSON.parse(cleanText);
      } catch (err) {
        console.error('Failed to parse AI response as JSON:', data.ai_analysis);
        // Fallback parsing if LLM output format is slightly off
        const scoreMatch = data.ai_analysis.match(/(score|rating)[\s":]*(\d+)/i);
        const summaryMatch = data.ai_analysis.match(/summary[\s":]*([^"\n]+)/i);
        parsedAnalysis = {
          resumeScore: scoreMatch ? parseInt(scoreMatch[2]) : 70,
          profileSummary: summaryMatch ? summaryMatch[1] : 'AI analyzed profile.',
          topTechnicalSkills: ['Software Engineering', 'Technical Skills']
        };
      }

      onAnalysisComplete(parsedAnalysis);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during resume analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept=".pdf"
          onChange={handleChange}
          disabled={loading}
        />

        <div className="upload-icon">
          {loading ? <FileText size={36} /> : <UploadCloud size={36} />}
        </div>
        
        <div className="upload-title">
          {loading ? 'Analyzing Profile...' : 'Drag & Drop your Resume'}
        </div>
        <div className="upload-hint">
          {loading ? 'Gemini AI is scanning the document details...' : 'Supports PDF format only'}
        </div>

        {error && (
          <div style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="scanning-overlay">
            <div className="scanning-line"></div>
            <div className="spinner"></div>
            <div className="upload-title" style={{ zIndex: 11 }}>AI Resume Scanner Active</div>
            <div className="upload-hint" style={{ zIndex: 11 }}>Extracting skills, evaluating career readiness, and summarizing strengths...</div>
          </div>
        )}
      </div>
    </div>
  );
}

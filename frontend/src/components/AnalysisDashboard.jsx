import React, { useState, useEffect } from 'react';
import { Award, FileText, CheckCircle, Database } from 'lucide-react';

export default function AnalysisDashboard({ analysisData, onSaveSuccess, onReset }) {
  const { resumeScore = 0, profileSummary = '', topTechnicalSkills = [] } = analysisData;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Circular gauge config
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (resumeScore / 100) * circumference;

  // Score styling
  let scoreClass = 'low';
  if (resumeScore >= 80) scoreClass = 'high';
  else if (resumeScore >= 50) scoreClass = 'medium';

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }
    setError(null);
    setSaving(true);

    const payload = {
      name,
      email,
      resumeScore,
      profileSummary,
      topTechnicalSkills
    };

    try {
      const response = await fetch('/api/candidates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile. Please verify connection.');
      }

      onSaveSuccess(`Student ${name} saved successfully!`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Sidebar: Score & Skills */}
      <div className="dashboard-sidebar">
        {/* Match Score */}
        <div className="glass-panel score-card">
          <h3 className="score-title">Career Readiness</h3>
          <div className="gauge-container">
            <svg className="gauge-svg">
              <circle className="gauge-bg" cx="75" cy="75" r={radius} />
              <circle 
                className="gauge-fill" 
                cx="75" 
                cy="75" 
                r={radius} 
                stroke={`url(#scoreGradient)`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-text">
              <span className="gauge-number">{resumeScore}</span>
              <span className="gauge-label">out of 100</span>
            </div>
          </div>
          <div className={`score-feedback ${scoreClass}`}>
            {resumeScore >= 80 ? 'Industry Ready' : resumeScore >= 50 ? 'Solid Foundation' : 'Requires Focus'}
          </div>
        </div>

        {/* Skills List */}
        <div className="glass-panel glass-card skills-card">
          <h3 className="section-header">
            <Award size={20} className="text-primary" style={{ color: 'var(--primary)' }} />
            Top Technical Skills
          </h3>
          <div className="skills-wrapper">
            {topTechnicalSkills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panel: Summary & Save Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Summary */}
        <div className="glass-panel glass-card summary-card">
          <h3 className="section-header">
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            Profile Summary
          </h3>
          <p className="summary-text">{profileSummary}</p>
        </div>

        {/* Save Form */}
        <div className="glass-panel glass-card save-form-card">
          <h3 className="section-header">
            <Database size={20} style={{ color: 'var(--primary)' }} />
            Save Profile to History
          </h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="cand-name">Student Name</label>
              <input 
                id="cand-name"
                type="text" 
                className="form-input" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="cand-email">Your Email Address</label>
              <input 
                id="cand-email"
                type="email" 
                className="form-input" 
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
                required
              />
            </div>

            {error && (
              <div style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="nav-tab-btn" 
                style={{ flex: 1, padding: '0.85rem' }} 
                onClick={onReset}
                disabled={saving}
              >
                Scan Another Resume
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ flex: 2 }}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile & Score'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

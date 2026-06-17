import React, { useState, useEffect } from 'react';
import { Search, Users, ShieldAlert, Award, FileText, X } from 'lucide-react';

export default function CandidateDatabase() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidate profiles.');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = candidate.name?.toLowerCase().includes(searchLower);
    const emailMatch = candidate.email?.toLowerCase().includes(searchLower);
    
    // Check skills
    const skills = candidate.resumeProfile?.topTechnicalSkills || [];
    const skillMatch = skills.some(skill => skill.toLowerCase().includes(searchLower));

    return nameMatch || emailMatch || skillMatch;
  });

  return (
    <div>
      {/* Search Bar & Stats */}
      <div className="db-header">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search saved profiles by name, email, or technical skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading database records...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <ShieldAlert size={48} />
          <div className="empty-state-title">Error Connecting to Server</div>
          <p>{error}</p>
          <button className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }} onClick={fetchCandidates}>
            Retry Connection
          </button>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <div className="empty-state-title">No Profiles Found</div>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'Begin by uploading and saving your resume assessment'}</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {filteredCandidates.map((candidate) => {
            const profile = candidate.resumeProfile || {};
            const skills = profile.topTechnicalSkills || [];
            const score = profile.resumeScore || 0;

            return (
              <div 
                key={candidate.id} 
                className="glass-panel glass-card candidate-card"
                onClick={() => setSelectedCandidate(candidate)}
              >
                <div className="candidate-card-header">
                  <div className="candidate-info">
                    <h3>{candidate.name}</h3>
                    <div className="candidate-email">{candidate.email}</div>
                  </div>
                  <div className="score-badge">
                    {score}
                  </div>
                </div>

                <p className="candidate-summary">
                  {profile.profileSummary || 'No summary available.'}
                </p>

                <div className="candidate-skills">
                  {skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-tag-sm">
                      {skill}
                    </span>
                  ))}
                  {skills.length > 4 && (
                    <span className="skill-tag-sm" style={{ fontWeight: 600 }}>
                      +{skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal view */}
      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
}

// Modal component
function CandidateModal({ candidate, onClose }) {
  const profile = candidate.resumeProfile || {};
  const skills = profile.topTechnicalSkills || [];
  const score = profile.resumeScore || 0;

  // Gauge details
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreClass = 'low';
  if (score >= 80) scoreClass = 'high';
  else if (score >= 50) scoreClass = 'medium';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-candidate-header">
          <div>
            <h2 className="modal-candidate-name">{candidate.name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{candidate.email}</p>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            {/* Score info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  padding: '1.5rem', 
                  textAlign: 'center' 
                }}
              >
                <div className="gauge-container" style={{ width: '130px', height: '130px' }}>
                  <svg className="gauge-svg">
                    <circle className="gauge-bg" cx="65" cy="65" r={radius} />
                    <circle 
                      className="gauge-fill" 
                      cx="65" 
                      cy="65" 
                      r={radius} 
                      stroke={`url(#modalScoreGradient)`}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                    <defs>
                      <linearGradient id="modalScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-text">
                    <span className="gauge-number" style={{ fontSize: '2rem' }}>{score}</span>
                    <span className="gauge-label" style={{ fontSize: '0.65rem' }}>out of 100</span>
                  </div>
                </div>
                <div className={`score-feedback ${scoreClass}`} style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                  {score >= 80 ? 'Industry Ready' : score >= 50 ? 'Solid Foundation' : 'Requires Focus'}
                </div>
              </div>

              {/* Skills */}
              <div className="glass-card">
                <h3 className="section-header" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                  <Award size={18} style={{ color: 'var(--primary)' }} />
                  Technical Skills
                </h3>
                <div className="skills-wrapper" style={{ gap: '0.4rem' }}>
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-badge" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile summary */}
            <div className="glass-card" style={{ height: 'fit-content' }}>
              <h3 className="section-header" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                Profile Summary
              </h3>
              <p style={{ lineHeight: '1.7', fontSize: '0.975rem' }}>
                {profile.profileSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

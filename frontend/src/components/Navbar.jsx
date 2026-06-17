import React from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon, Briefcase } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand" onClick={() => setActiveTab('analyze')}>
        <Briefcase size={28} />
        <span>CareerAI</span>
      </div>

      <div className="nav-controls">
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyze')}
          >
            Assess Resume
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            Assessment History
          </button>
        </div>

        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <div className="theme-toggle-slider">
            {theme === 'light' ? <Sun /> : <Moon />}
          </div>
        </button>
      </div>
    </nav>
  );
}

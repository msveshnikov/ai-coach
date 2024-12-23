import { useState } from 'react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('training');
  const [selectedFeature, setSelectedFeature] = useState(null);

  const navigationItems = {
    training: ['Exercise Library', 'Session Planning', 'Performance Tracking'],
    coaching: ['Goal Setting', 'Team Management', 'Exercise Recommendations'],
    club: ['Philosophy', 'Age Groups', 'Development Pathways'],
    profile: ['Certifications', 'Experience', 'Achievements']
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSelectedFeature(null);
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Training Management System</h1>
        <nav className="main-nav">
          <button
            className={activeSection === 'training' ? 'active' : ''}
            onClick={() => handleNavigation('training')}
          >
            Training
          </button>
          <button
            className={activeSection === 'coaching' ? 'active' : ''}
            onClick={() => handleNavigation('coaching')}
          >
            Coaching
          </button>
          <button
            className={activeSection === 'club' ? 'active' : ''}
            onClick={() => handleNavigation('club')}
          >
            Club
          </button>
          <button
            className={activeSection === 'profile' ? 'active' : ''}
            onClick={() => handleNavigation('profile')}
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="main-content">
        <aside className="feature-sidebar">
          {navigationItems[activeSection].map((feature) => (
            <button
              key={feature}
              className={selectedFeature === feature ? 'active' : ''}
              onClick={() => handleFeatureSelect(feature)}
            >
              {feature}
            </button>
          ))}
        </aside>

        <section className="feature-content">
          {selectedFeature ? (
            <div className="feature-details">
              <h2>{selectedFeature}</h2>
              <p>Feature content will be implemented here.</p>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management</h2>
              <p>Select a feature to get started</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Training Management System - Phase 1</p>
      </footer>
    </div>
  );
}

export default App;
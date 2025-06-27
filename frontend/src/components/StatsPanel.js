import React from 'react';
import './StatsPanel.css';

const StatsPanel = ({ stats }) => {
  const { 
    totalCards = 0, 
    masteredCards = 0, 
    progressPercentage = 0 
  } = stats;

  const remainingCards = totalCards - masteredCards;

  return (
    <div className="stats-panel">
      <h3>📊 Voortgang</h3>
      
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Leervoortgang</span>
          <span className="progress-percentage">{progressPercentage}%</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${progressPercentage}% van flashcards beheerst`}
          ></div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{totalCards}</div>
            <div className="stat-label">Totaal</div>
          </div>
        </div>

        <div className="stat-item mastered">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{masteredCards}</div>
            <div className="stat-label">Beheerst</div>
          </div>
        </div>

        <div className="stat-item learning">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{remainingCards}</div>
            <div className="stat-label">Nog leren</div>
          </div>
        </div>
      </div>

      <div className="motivation-section">
        {progressPercentage === 100 ? (
          <div className="motivation-message success">
            <span className="motivation-icon">🎉</span>
            <p>Geweldig! Je hebt alle kaarten beheerst!</p>
          </div>
        ) : progressPercentage >= 75 ? (
          <div className="motivation-message good">
            <span className="motivation-icon">🔥</span>
            <p>Bijna klaar! Nog {remainingCards} kaarten te gaan!</p>
          </div>
        ) : progressPercentage >= 50 ? (
          <div className="motivation-message progress">
            <span className="motivation-icon">💪</span>
            <p>Goed bezig! Je bent al meer dan halverwege!</p>
          </div>
        ) : progressPercentage > 0 ? (
          <div className="motivation-message start">
            <span className="motivation-icon">🌱</span>
            <p>Goede start! Blijf oefenen!</p>
          </div>
        ) : (
          <div className="motivation-message begin">
            <span className="motivation-icon">🚀</span>
            <p>Begin met leren en behaal je doelen!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel; 
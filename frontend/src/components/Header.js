import React from 'react';
import './Header.css';

const Header = ({ onAddCard }) => {
  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="logo">
            <span className="logo-icon">🎓</span>
            StudyCards
          </h1>
          <p className="tagline">Leren met slimme flashcards</p>
        </div>
        
        <nav className="nav" role="navigation" aria-label="Hoofdnavigatie">
          <button 
            className="btn btn-primary"
            onClick={onAddCard}
            aria-label="Nieuwe flashcard toevoegen"
          >
            <span className="btn-icon">➕</span>
            Nieuwe Kaart
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
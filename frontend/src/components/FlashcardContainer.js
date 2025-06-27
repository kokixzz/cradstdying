import React, { useState } from 'react';
import Flashcard from './Flashcard';
import './FlashcardContainer.css';

const FlashcardContainer = ({ flashcards, onCardUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyMode, setStudyMode] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="no-cards">
        <div className="no-cards-content">
          <span className="no-cards-icon">📚</span>
          <h3>Geen flashcards gevonden</h3>
          <p>Voeg je eerste flashcard toe om te beginnen met leren!</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleStudyModeToggle = () => {
    setStudyMode(!studyMode);
    setCurrentIndex(0);
  };

  if (studyMode) {
    return (
      <div className="flashcard-container study-mode">
        <div className="study-header">
          <h2>Studiemodus</h2>
          <div className="study-controls">
            <span className="card-counter">
              {currentIndex + 1} van {flashcards.length}
            </span>
            <button 
              className="btn btn-secondary"
              onClick={handleStudyModeToggle}
              aria-label="Studiemodus uitschakelen"
            >
              Overzicht
            </button>
          </div>
        </div>

        <div className="study-card-wrapper">
          <Flashcard 
            card={flashcards[currentIndex]}
            onUpdate={onCardUpdate}
            showActions={true}
          />
          
          <div className="study-navigation">
            <button 
              className="btn btn-nav"
              onClick={handlePrevious}
              disabled={flashcards.length <= 1}
              aria-label="Vorige kaart"
            >
              ⬅️ Vorige
            </button>
            <button 
              className="btn btn-nav"
              onClick={handleNext}
              disabled={flashcards.length <= 1}
              aria-label="Volgende kaart"
            >
              Volgende ➡️
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="container-header">
        <h2>Flashcards ({flashcards.length})</h2>
        <button 
          className="btn btn-primary"
          onClick={handleStudyModeToggle}
          aria-label="Studiemodus starten"
        >
          <span className="btn-icon">🎯</span>
          Studiemodus
        </button>
      </div>

      <div className="flashcards-grid">
        {flashcards.map((card) => (
          <Flashcard 
            key={card.id}
            card={card}
            onUpdate={onCardUpdate}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardContainer; 
import React, { useState } from 'react';
import { updateFlashcard, deleteFlashcard } from '../services/api';
import './Flashcard.css';

const Flashcard = ({ card, onUpdate, showActions = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  const handleMasteredToggle = async () => {
    try {
      setIsLoading(true);
      await updateFlashcard(card.id, { 
        ...card, 
        mastered: !card.mastered 
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Fout bij het bijwerken van de kaart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Weet je zeker dat je deze flashcard wilt verwijderen?')) {
      try {
        setIsLoading(true);
        await deleteFlashcard(card.id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting card:', error);
        alert('Fout bij het verwijderen van de kaart');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': '#4CAF50',
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'hard': '#F44336',
      'advanced': '#F44336'
    };
    return colors[difficulty.toLowerCase()] || '#2196F3';
  };

  return (
    <div className="flashcard-wrapper">
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''} ${card.mastered ? 'mastered' : ''}`}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard: ${card.question}. Druk op Enter om om te draaien.`}
        aria-pressed={isFlipped}
      >
        <div className="flashcard-inner">
          {/* Front side - Question */}
          <div className="flashcard-front">
            <div className="card-header">
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
              >
                {card.difficulty}
              </span>
              <span className="category-badge">
                {card.category}
              </span>
            </div>
            
            <div className="card-content">
              <div className="question-icon">❓</div>
              <h3 className="question">{card.question}</h3>
            </div>
            
            <div className="card-footer">
              <span className="flip-hint">Klik om antwoord te zien</span>
            </div>
          </div>

          {/* Back side - Answer */}
          <div className="flashcard-back">
            <div className="card-header">
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
              >
                {card.difficulty}
              </span>
              <span className="category-badge">
                {card.category}
              </span>
            </div>
            
            <div className="card-content">
              <div className="answer-icon">💡</div>
              <h3 className="answer">{card.answer}</h3>
            </div>
            
            <div className="card-footer">
              <span className="flip-hint">Klik om vraag te zien</span>
            </div>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flashcard-actions">
          <button
            className={`btn btn-small ${card.mastered ? 'btn-mastered' : 'btn-outline'}`}
            onClick={handleMasteredToggle}
            disabled={isLoading}
            aria-label={card.mastered ? 'Markeer als niet beheerst' : 'Markeer als beheerst'}
          >
            {card.mastered ? '✅ Beheerst' : '⭕ Nog leren'}
          </button>
          
          <button
            className="btn btn-small btn-danger"
            onClick={handleDelete}
            disabled={isLoading}
            aria-label="Verwijder flashcard"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard; 
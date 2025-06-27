import React, { useState } from 'react';
import { createFlashcard } from '../services/api';
import './AddCardModal.css';

const AddCardModal = ({ onClose, onCardAdded }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    difficulty: 'Beginner'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Vraag is verplicht';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Antwoord is verplicht';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categorie is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await createFlashcard({
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category.trim(),
        difficulty: formData.difficulty
      });
      onCardAdded();
    } catch (error) {
      console.error('Error creating flashcard:', error);
      alert('Fout bij het aanmaken van de flashcard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleModalClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">➕ Nieuwe Flashcard</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="question">
              Vraag <span className="required">*</span>
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Wat wil je leren?"
              rows={3}
              className={errors.question ? 'error' : ''}
              required
            />
            {errors.question && (
              <span className="error-message">{errors.question}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="answer">
              Antwoord <span className="required">*</span>
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Het juiste antwoord..."
              rows={3}
              className={errors.answer ? 'error' : ''}
              required
            />
            {errors.answer && (
              <span className="error-message">{errors.answer}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Categorie <span className="required">*</span>
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="bijv. Wiskunde, Geschiedenis..."
                className={errors.category ? 'error' : ''}
                required
              />
              {errors.category && (
                <span className="error-message">{errors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Moeilijkheidsgraad</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="Easy">Makkelijk</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Gemiddeld</option>
                <option value="Hard">Moeilijk</option>
                <option value="Advanced">Gevorderd</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuleren
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Opslaan...' : 'Flashcard Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal; 
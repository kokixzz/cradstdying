import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FlashcardContainer from './components/FlashcardContainer';
import FilterPanel from './components/FilterPanel';
import StatsPanel from './components/StatsPanel';
import AddCardModal from './components/AddCardModal';
import { fetchFlashcards, fetchStats } from './services/api';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    mastered: 'all'
  });

  useEffect(() => {
    loadFlashcards();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [flashcards, filters]);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const cards = await fetchFlashcards();
      setFlashcards(cards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = flashcards;

    if (filters.category !== 'all') {
      filtered = filtered.filter(card => 
        card.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(card => 
        card.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    if (filters.mastered !== 'all') {
      filtered = filtered.filter(card => 
        card.mastered === (filters.mastered === 'true')
      );
    }

    setFilteredCards(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCardUpdate = () => {
    loadFlashcards();
    loadStats();
  };

  const handleAddCard = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleCardAdded = () => {
    loadFlashcards();
    loadStats();
    setShowAddModal(false);
  };

  return (
    <div className="App">
      <Header onAddCard={handleAddCard} />
      
      <main className="main-content">
        <div className="sidebar">
          <StatsPanel stats={stats} />
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange}
            categories={stats.categories || []}
          />
        </div>
        
        <div className="content-area">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Flashcards laden...</p>
            </div>
          ) : (
            <FlashcardContainer 
              flashcards={filteredCards}
              onCardUpdate={handleCardUpdate}
            />
          )}
        </div>
      </main>

      {showAddModal && (
        <AddCardModal 
          onClose={handleModalClose}
          onCardAdded={handleCardAdded}
        />
      )}
    </div>
  );
}

export default App; 
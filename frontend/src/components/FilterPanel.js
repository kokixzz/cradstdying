import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, categories }) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      difficulty: 'all',
      mastered: 'all'
    });
  };

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.difficulty !== 'all' || 
                          filters.mastered !== 'all';

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🔍 Filters</h3>
        {hasActiveFilters && (
          <button 
            className="btn btn-small btn-outline"
            onClick={clearFilters}
            aria-label="Alle filters wissen"
          >
            Wissen
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Categorie</label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="all">Alle categorieën</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="difficulty-filter">Moeilijkheid</label>
        <select
          id="difficulty-filter"
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          className="filter-select"
        >
          <option value="all">Alle niveaus</option>
          <option value="easy">Makkelijk</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Gemiddeld</option>
          <option value="hard">Moeilijk</option>
          <option value="advanced">Gevorderd</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="mastered-filter">Status</label>
        <select
          id="mastered-filter"
          value={filters.mastered}
          onChange={(e) => handleFilterChange('mastered', e.target.value)}
          className="filter-select"
        >
          <option value="all">Alle kaarten</option>
          <option value="false">Nog leren</option>
          <option value="true">Beheerst</option>
        </select>
      </div>

      <div className="filter-summary">
        <p className="filter-info">
          {hasActiveFilters ? (
            <>
              <span className="active-filters-icon">🎯</span>
              Actieve filters
            </>
          ) : (
            <>
              <span className="all-filters-icon">📚</span>
              Alle kaarten
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default FilterPanel; 
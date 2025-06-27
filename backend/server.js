const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database setup
const dbPath = path.join(__dirname, 'studycards.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// More permissive CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helper function to run database queries with promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const runQuerySingle = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const runInsert = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

const runUpdate = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

// API Routes
app.get('/api/flashcards', async (req, res) => {
  try {
    const { category, difficulty, mastered } = req.query;
    let query = 'SELECT * FROM flashcards WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (difficulty && difficulty !== 'all') {
      query += ' AND LOWER(difficulty) = LOWER(?)';
      params.push(difficulty);
    }

    if (mastered !== undefined && mastered !== 'all') {
      query += ' AND mastered = ?';
      params.push(mastered === 'true' ? 1 : 0);
    }

    query += ' ORDER BY createdAt DESC';

    const cards = await runQuery(query, params);
    res.json(cards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/flashcards/:id', async (req, res) => {
  try {
    const card = await runQuerySingle('SELECT * FROM flashcards WHERE id = ?', [req.params.id]);
    if (!card) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/flashcards', async (req, res) => {
  try {
    const { question, answer, category, difficulty } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }
    
    const result = await runInsert(
      'INSERT INTO flashcards (question, answer, category, difficulty, mastered) VALUES (?, ?, ?, ?, ?)',
      [question, answer, category || 'General', difficulty || 'Beginner', 0]
    );
    
    const newCard = await runQuerySingle('SELECT * FROM flashcards WHERE id = ?', [result.id]);
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/flashcards/:id', async (req, res) => {
  try {
    const { question, answer, category, difficulty, mastered } = req.body;
    
    const result = await runUpdate(
      'UPDATE flashcards SET question = ?, answer = ?, category = ?, difficulty = ?, mastered = ? WHERE id = ?',
      [question, answer, category, difficulty, mastered ? 1 : 0, req.params.id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    const updatedCard = await runQuerySingle('SELECT * FROM flashcards WHERE id = ?', [req.params.id]);
    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/flashcards/:id', async (req, res) => {
  try {
    const result = await runUpdate('DELETE FROM flashcards WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalCards = await runQuerySingle('SELECT COUNT(*) as count FROM flashcards');
    const masteredCards = await runQuerySingle('SELECT COUNT(*) as count FROM flashcards WHERE mastered = 1');
    const categories = await runQuery('SELECT DISTINCT category FROM flashcards');
    
    const stats = {
      totalCards: totalCards.count,
      masteredCards: masteredCards.count,
      progressPercentage: totalCards.count > 0 ? Math.round((masteredCards.count / totalCards.count) * 100) : 0,
      categories: categories.map(cat => cat.category)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'SQLite' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Database: SQLite (persistent storage)');
}); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'studycards.db');

// Create/connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create flashcards table
const createTable = `
  CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    difficulty TEXT DEFAULT 'Beginner',
    mastered BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Sample data
const sampleData = [
  {
    question: "Wat is React?",
    answer: "Een JavaScript library voor het bouwen van user interfaces",
    category: "Programming",
    difficulty: "Beginner",
    mastered: 0
  },
  {
    question: "Wat betekent API?",
    answer: "Application Programming Interface - een set regels voor communicatie tussen software componenten",
    category: "Programming",
    difficulty: "Beginner",
    mastered: 0
  },
  {
    question: "Wat is de hoofdstad van Nederland?",
    answer: "Amsterdam",
    category: "Geografie",
    difficulty: "Easy",
    mastered: 1
  },
  {
    question: "Wat is de formule voor de oppervlakte van een cirkel?",
    answer: "π × r²",
    category: "Wiskunde",
    difficulty: "Intermediate",
    mastered: 0
  }
];

// Initialize database
db.serialize(() => {
  // Create table
  db.run(createTable, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Flashcards table created successfully.');
    }
  });

  // Insert sample data
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO flashcards (question, answer, category, difficulty, mastered)
    VALUES (?, ?, ?, ?, ?)
  `);

  sampleData.forEach((card) => {
    insertStmt.run([card.question, card.answer, card.category, card.difficulty, card.mastered], (err) => {
      if (err) {
        console.error('Error inserting sample data:', err.message);
      }
    });
  });

  insertStmt.finalize((err) => {
    if (err) {
      console.error('Error finalizing insert:', err.message);
    } else {
      console.log('Sample data inserted successfully.');
    }
  });

  // Verify data
  db.all('SELECT * FROM flashcards', (err, rows) => {
    if (err) {
      console.error('Error querying data:', err.message);
    } else {
      console.log(`Database initialized with ${rows.length} flashcards.`);
    }
    
    // Close database
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
}); 
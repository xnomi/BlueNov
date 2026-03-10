const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize Database Schema
db.serialize(() => {
    // Novels Table
    db.run(`CREATE TABLE IF NOT EXISTS novels (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        cover TEXT,
        synopsis TEXT,
        status TEXT,
        views INTEGER DEFAULT 0,
        rating REAL DEFAULT 0.0,
        updatedAt TEXT
    )`);

    // Genres Table
    db.run(`CREATE TABLE IF NOT EXISTS genres (
        novel_id TEXT,
        genre TEXT,
        FOREIGN KEY(novel_id) REFERENCES novels(id) ON DELETE CASCADE
    )`);

    // Chapters Table
    db.run(`CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        novel_id TEXT,
        title TEXT NOT NULL,
        content TEXT,
        wordCount INTEGER,
        FOREIGN KEY(novel_id) REFERENCES novels(id) ON DELETE CASCADE
    )`);
});

// Promisified helper methods for easier async/await usage
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this); // returns { lastID, changes }
        });
    });
};

module.exports = { db, query, run };

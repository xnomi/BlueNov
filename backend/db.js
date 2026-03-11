const mysql = require('mysql2/promise');

// Create a connection pool to the XAMPP MySQL database named 'bluenov'
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Default XAMPP user
    password: '', // Default XAMPP password is empty
    database: 'bluenov',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize Database Schema in MySQL
const initDb = async () => {
    try {
        const connection = await pool.getConnection();

        // Novels Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS novels (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                cover TEXT,
                synopsis TEXT,
                status VARCHAR(50),
                views INT DEFAULT 0,
                rating FLOAT DEFAULT 0.0,
                updatedAt VARCHAR(255)
            )
        `);

        // Genres Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS genres (
                novel_id VARCHAR(255),
                genre VARCHAR(100),
                FOREIGN KEY(novel_id) REFERENCES novels(id) ON DELETE CASCADE
            )
        `);

        // Chapters Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS chapters (
                id VARCHAR(255) PRIMARY KEY,
                novel_id VARCHAR(255),
                title VARCHAR(255) NOT NULL,
                content LONGTEXT,
                wordCount INT,
                FOREIGN KEY(novel_id) REFERENCES novels(id) ON DELETE CASCADE
            )
        `);

        connection.release();
        console.log("MySQL Database schema initialized successfully.");
    } catch (err) {
        console.error("Error initializing MySQL schema:", err);
    }
};

initDb();

// Promisified helper methods to keep the same interface as our SQLite version
const query = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
};

const run = async (sql, params = []) => {
    const [result] = await pool.execute(sql, params);
    return result; // returns { insertId, affectedRows, etc. }
};

module.exports = { pool, query, run };

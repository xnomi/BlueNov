const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../db');
const { put } = require('@vercel/blob');

// Multer Config for Memory Storage (Vercel Blob)
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to assemble a novel with its genres and chapters
async function getNovelFullDetails(novelId) {
    const novelRows = await query(`SELECT * FROM novels WHERE id = ?`, [novelId]);
    if (!novelRows.length) return null;
    const novel = novelRows[0];

    const genreRows = await query(`SELECT genre FROM genres WHERE novel_id = ?`, [novelId]);
    novel.genres = genreRows.map(g => g.genre);

    const chapters = await query(`SELECT * FROM chapters WHERE novel_id = ? ORDER BY id ASC`, [novelId]);
    novel.chapters = chapters;

    // Optional parsing of stringified numbers if needed
    return novel;
}

// GET all novels (including genres and chapters)
router.get('/', async (req, res) => {
    try {
        const novels = await query(`SELECT * FROM novels ORDER BY updatedAt DESC`);

        // Fetch all genres and chapters to map them to novels efficiently
        const allGenres = await query(`SELECT * FROM genres`);
        const allChapters = await query(`SELECT * FROM chapters ORDER BY id ASC`);

        for (let novel of novels) {
            novel.genres = allGenres.filter(g => g.novel_id === novel.id).map(g => g.genre);
            novel.chapters = allChapters.filter(c => c.novel_id === novel.id);
        }

        res.json(novels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch novels' });
    }
});

// GET single novel by ID
router.get('/:id', async (req, res) => {
    try {
        const novel = await getNovelFullDetails(req.params.id);
        if (!novel) return res.status(404).json({ error: 'Novel not found' });
        res.json(novel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch novel' });
    }
});

// POST create novel
router.post('/', upload.single('coverImage'), async (req, res) => {
    try {
        const id = uuidv4();
        const { title, author, synopsis, status, views, rating, genres } = req.body;

        let coverUrl = req.body.cover || null;
        if (req.file) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(req.file.originalname);
            const blob = await put(`covers/cover-${uniqueSuffix}${ext}`, req.file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });
            coverUrl = blob.url;
        }

        const updatedAt = new Date().toISOString();

        await run(
            `INSERT INTO novels (id, title, author, cover, synopsis, status, views, rating, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, author, coverUrl, synopsis, status, views || 0, rating || 0, updatedAt]
        );

        // Insert genres
        if (genres) {
            // Genres might arrive as JSON string if sent from FormData
            const parsedGenres = typeof genres === 'string' ? JSON.parse(genres) : genres;
            for (let genre of parsedGenres) {
                await run(`INSERT INTO genres (novel_id, genre) VALUES (?, ?)`, [id, genre]);
            }
        }

        const newNovel = await getNovelFullDetails(id);
        res.status(201).json(newNovel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create novel' });
    }
});

// PUT update novel
router.put('/:id', upload.single('coverImage'), async (req, res) => {
    try {
        const novelId = req.params.id;
        const exists = await query(`SELECT id FROM novels WHERE id = ?`, [novelId]);
        if (!exists.length) return res.status(404).json({ error: 'Novel not found' });

        const { title, author, synopsis, status, views, rating, genres } = req.body;

        let coverUrl = req.body.cover || null;
        if (req.file) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(req.file.originalname);
            const blob = await put(`covers/cover-${uniqueSuffix}${ext}`, req.file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });
            coverUrl = blob.url;
        }

        const updatedAt = new Date().toISOString();

        await run(
            `UPDATE novels 
             SET title = ?, author = ?, synopsis = ?, status = ?, views = ?, rating = ?, updatedAt = ?, cover = COALESCE(?, cover)
             WHERE id = ?`,
            [title, author, synopsis, status, views, rating, updatedAt, coverUrl, novelId]
        );

        if (genres) {
            const parsedGenres = typeof genres === 'string' ? JSON.parse(genres) : genres;
            await run(`DELETE FROM genres WHERE novel_id = ?`, [novelId]);
            for (let genre of parsedGenres) {
                await run(`INSERT INTO genres (novel_id, genre) VALUES (?, ?)`, [novelId, genre]);
            }
        }

        const updatedNovel = await getNovelFullDetails(novelId);
        res.json(updatedNovel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update novel' });
    }
});

// DELETE novel
router.delete('/:id', async (req, res) => {
    try {
        const novelId = req.params.id;
        // Due to ON DELETE CASCADE on genres and chapters, this handles related records
        await run(`DELETE FROM novels WHERE id = ?`, [novelId]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete novel' });
    }
});

// POST add chapter
router.post('/:id/chapters', async (req, res) => {
    try {
        const novelId = req.params.id;
        const { id, title, content, wordCount } = req.body; // id can be generated on client or server
        const chapterId = id || uuidv4();

        await run(
            `INSERT INTO chapters (id, novel_id, title, content, wordCount) VALUES (?, ?, ?, ?, ?)`,
            [chapterId, novelId, title, content, wordCount]
        );

        res.status(201).json({ id: chapterId, novelId, title, content, wordCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add chapter' });
    }
});

module.exports = router;

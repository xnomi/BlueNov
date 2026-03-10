const { run, db } = require('./db');
const { v4: uuidv4 } = require('uuid');

const DUMMY_NOVELS = [
    {
        id: uuidv4(),
        title: 'Echoes of the Abyss',
        author: 'Selene Voss',
        cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80',
        synopsis: 'In a world where shadows hold memories, the last memory-weaver must descend into the Abyss.',
        genres: ['Fantasy', 'Adventure'],
        status: 'Ongoing',
        views: 184320,
        rating: 4.8,
        chapters: []
    },
    {
        id: uuidv4(),
        title: 'Neon Gods',
        author: 'Kaelen Rive',
        cover: 'https://images.unsplash.com/photo-1554160408-54cd798b6727?w=400&q=80',
        synopsis: 'Cyberpunk dystopia meets Greek mythology. Hades rules the undercity, Persephone is a hacker fleeing her corporate mother.',
        genres: ['Sci-Fi', 'Action'],
        status: 'Ongoing',
        views: 450200,
        rating: 4.9,
        chapters: []
    }
];

(async () => {
    try {
        console.log("Seeding SQLite database...");
        for (let n of DUMMY_NOVELS) {
            const updatedAt = new Date().toISOString();
            await run('INSERT OR IGNORE INTO novels (id, title, author, cover, synopsis, status, views, rating, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [n.id, n.title, n.author, n.cover, n.synopsis, n.status, n.views, n.rating, updatedAt]);

            for (let g of n.genres) {
                await run('INSERT OR IGNORE INTO genres (novel_id, genre) VALUES (?, ?)', [n.id, g]);
            }
            console.log('Imported: ' + n.title);
        }
        console.log('Seeding complete!');
    } catch (e) {
        console.error("Seeding failed:", e);
    } finally {
        db.close();
    }
})();

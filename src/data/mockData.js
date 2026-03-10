// Static mock data for UI elements not yet migrated to the backend
export const GENRES = [
  'Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Action',
  'Horror', 'Adventure', 'Thriller', 'Drama', 'Historical'
];

export const NOVELS = []; // Empty array, novels are now dynamically loaded from the API

export const ADMIN_METRICS = {
  totalNovels: 10,
  totalChapters: 12,
  totalViews: 1450200,
  activeReaders: 3842,
  dailyPageViews: 28650,
  newUsersToday: 214,
};

export const RECENT_ACTIVITY = [
  { id: 1, action: 'New chapter added', novel: 'Beneath Neon Skies', time: '2 hours ago' },
  { id: 2, action: 'Novel published', novel: 'Crimson Protocol', time: '5 hours ago' },
  { id: 3, action: 'Chapter updated', novel: 'Echoes of the Abyss', time: '1 day ago' },
  { id: 4, action: 'New novel added', novel: 'The Midnight Garden', time: '2 days ago' },
  { id: 5, action: 'Novel completed', novel: 'The Steel Sovereign', time: '18 days ago' },
];

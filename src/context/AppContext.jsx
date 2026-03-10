import { createContext, useContext, useReducer, useEffect } from 'react';
import { NOVELS } from '../data/mockData';

// ── Initial State ─────────────────────────────────────────────
const initialState = {
    novels: [],
    adminAuth: false,
    searchQuery: '',
    selectedGenre: 'All',
    selectedStatus: 'All',
    isLoadingNovels: true,
};

// ── Reducer ───────────────────────────────────────────────────
function appReducer(state, action) {
    switch (action.type) {
        case 'ADMIN_LOGIN':
            return { ...state, adminAuth: true };
        case 'ADMIN_LOGOUT':
            return { ...state, adminAuth: false };
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };
        case 'SET_GENRE':
            return { ...state, selectedGenre: action.payload };
        case 'SET_STATUS':
            return { ...state, selectedStatus: action.payload };
        case 'SET_NOVELS':
            return { ...state, novels: action.payload, isLoadingNovels: false };
        case 'ADD_NOVEL':
            return { ...state, novels: [action.payload, ...state.novels] };
        case 'UPDATE_NOVEL':
            return {
                ...state,
                novels: state.novels.map(n =>
                    n.id === action.payload.id ? { ...n, ...action.payload } : n
                ),
            };
        case 'DELETE_NOVEL':
            return { ...state, novels: state.novels.filter(n => n.id !== action.payload) };
        case 'ADD_CHAPTER':
            return {
                ...state,
                novels: state.novels.map(n =>
                    n.id === action.payload.novelId
                        ? { ...n, chapters: [...n.chapters, action.payload.chapter] }
                        : n
                ),
            };
        default:
            return state;
    }
}

// ── Context ───────────────────────────────────────────────────
const AppContext = createContext(null);

// ── Local Progress Helpers ─────────────────────────────────────
const PROGRESS_KEY = 'bluenov_progress';

export function getReadingProgress(novelId) {
    try {
        const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
        return all[novelId] || null;
    } catch {
        return null;
    }
}

export function saveReadingProgress(novelId, chapterId) {
    try {
        const all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
        all[novelId] = { chapterId, savedAt: new Date().toISOString() };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    } catch {
        // ignore
    }
}

// ── Provider ──────────────────────────────────────────────────
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
        // Re-hydrate admin auth from session storage
        const adminAuth = sessionStorage.getItem('bluenov_admin') === 'true';
        return { ...init, adminAuth };
    });

    // Fetch novels from backend API
    useEffect(() => {
        // Only fetch once on mount
        fetch('http://localhost:5000/api/novels')
            .then(res => res.json())
            .then(data => {
                dispatch({ type: 'SET_NOVELS', payload: data });
            })
            .catch(err => {
                console.error("Failed to fetch novels from API:", err);
                // Fallback empty state is already handled by initialState
                dispatch({ type: 'SET_NOVELS', payload: [] });
            });
    }, []);

    // Persist admin auth to session storage
    useEffect(() => {
        sessionStorage.setItem('bluenov_admin', state.adminAuth.toString());
    }, [state.adminAuth]);

    // Computed: filtered novels
    const filteredNovels = state.novels.filter(novel => {
        const matchesSearch =
            !state.searchQuery ||
            novel.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            novel.author.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesGenre =
            state.selectedGenre === 'All' || novel.genres.includes(state.selectedGenre);
        const matchesStatus =
            state.selectedStatus === 'All' || novel.status === state.selectedStatus;
        return matchesSearch && matchesGenre && matchesStatus;
    });

    const getNovelById = (id) => state.novels.find(n => n.id === id) || null;

    const adminLogin = (username, password) => {
        if (username === 'admin' && password === 'password123') {
            dispatch({ type: 'ADMIN_LOGIN' });
            return true;
        }
        return false;
    };

    const adminLogout = () => dispatch({ type: 'ADMIN_LOGOUT' });

    const value = {
        ...state,
        filteredNovels,
        getNovelById,
        adminLogin,
        adminLogout,
        dispatch,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

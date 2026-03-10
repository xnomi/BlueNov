import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

// ── Lazy-loaded public pages ─────────────────────────────────
const Home = lazy(() => import('../pages/Home'));
const Discover = lazy(() => import('../pages/Discover'));
const NovelDetail = lazy(() => import('../pages/NovelDetail'));
const ReadingPage = lazy(() => import('../pages/ReadingPage'));

// ── Lazy-loaded admin pages ───────────────────────────────────
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const NovelManager = lazy(() => import('../pages/admin/NovelManager'));
const NovelForm = lazy(() => import('../pages/admin/NovelForm'));
const ChapterForm = lazy(() => import('../pages/admin/ChapterForm'));

// ── Private Route ─────────────────────────────────────────────
function PrivateRoute({ children }) {
    const { adminAuth } = useApp();
    return adminAuth ? children : <Navigate to="/admin/login" replace />;
}

// ── App Router ────────────────────────────────────────────────
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner fullPage />}>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/novel/:id" element={<NovelDetail />} />
                    <Route path="/novel/:id/chapter/:chapterId" element={<ReadingPage />} />

                    {/* Admin */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<PrivateRoute><Navigate to="/admin/dashboard" replace /></PrivateRoute>} />
                    <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                    <Route path="/admin/novels" element={<PrivateRoute><NovelManager /></PrivateRoute>} />
                    <Route path="/admin/novels/new" element={<PrivateRoute><NovelForm /></PrivateRoute>} />
                    <Route path="/admin/novels/:id/edit" element={<PrivateRoute><NovelForm /></PrivateRoute>} />
                    <Route path="/admin/novels/:id/chapters/new" element={<PrivateRoute><ChapterForm /></PrivateRoute>} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

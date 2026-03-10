import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/images/bluenovlogo.png';

const NAV_ITEMS = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/novels', icon: '📚', label: 'Novels' },
    { to: '/admin/novels/new', icon: '➕', label: 'Add Novel' },
];

export function AdminLayout({ children, title }) {
    const { adminLogout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    return (
        <div>
            <Helmet>
                <title>{title} — BlueNov Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Brand */}
                <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={logo} alt="BlueNov" height="32" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.5rem', marginBottom: 0 }}>
                        ADMIN PANEL
                    </p>
                </div>

                {/* Nav */}
                <nav style={{ padding: '0.75rem 0' }}>
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`admin-nav-link ${location.pathname === item.to ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Divider */}
                <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '0.25rem 1rem' }} />

                {/* Public site link */}
                <Link to="/" className="admin-nav-link" target="_blank">
                    <span className="icon">🌐</span>
                    View Site
                </Link>

                {/* Logout */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(255,82,82,0.1)',
                            border: '1px solid rgba(255,82,82,0.2)',
                            color: '#ff8a80',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            transition: 'all var(--transition-fast)',
                        }}
                        id="admin-logout-btn"
                    >
                        🚪 Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="admin-content">
                {/* Top bar */}
                <div style={{
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '0.9rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}>
                    {/* Mobile menu toggle */}
                    <button
                        className="d-md-none"
                        onClick={() => setSidebarOpen(o => !o)}
                        style={{
                            background: 'var(--bg-elevated)',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            padding: '0.4rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                        }}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                        {title}
                    </h1>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ✦ Admin
                    </span>
                </div>

                {/* Page content */}
                <div style={{ padding: '2rem 1.5rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

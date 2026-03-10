import { useApp } from '../../context/AppContext';
import { ADMIN_METRICS, RECENT_ACTIVITY } from '../../data/mockData';
import { AdminLayout } from './AdminLayout';
import MetricCard from '../../components/MetricCard';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

function fmt(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
    return String(n);
}

const METRICS = [
    { key: 'totalNovels', label: 'Total Novels', icon: '📚', color: 'var(--accent)' },
    { key: 'totalChapters', label: 'Total Chapters', icon: '📖', color: 'var(--blue)' },
    { key: 'activeReaders', label: 'Active Readers', icon: '👥', color: '#00e676' },
    { key: 'dailyPageViews', label: 'Daily Page Views', icon: '📈', color: '#ffca28' },
    { key: 'totalViews', label: 'Total Views', icon: '👁️', color: '#9c27b0' },
    { key: 'newUsersToday', label: 'New Today', icon: '✨', color: '#ff7043' },
];

export default function AdminDashboard() {
    const { novels } = useApp();

    // Use live novel count for totalNovels
    const liveMetrics = { ...ADMIN_METRICS, totalNovels: novels.length };

    return (
        <AdminLayout title="Dashboard">
            {/* Metrics Grid */}
            <div className="row g-3 mb-4">
                {METRICS.map((m, i) => (
                    <div key={m.key} className="col-6 col-md-4 col-lg-2" style={{ minWidth: 160 }}>
                        <MetricCard
                            icon={m.icon}
                            label={m.label}
                            value={fmt(liveMetrics[m.key] || 0)}
                            color={m.color}
                            delay={i * 60}
                        />
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                        <h6 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                            Quick Actions
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                            <Link to="/admin/novels/new" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>
                                ➕ Add Novel
                            </Link>
                            <Link to="/admin/novels" className="btn btn-outline-primary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>
                                📚 Manage Novels
                            </Link>
                            <Link to="/" target="_blank" className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>
                                🌐 View Site
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Completion stats */}
                <div className="col-md-6">
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                        <h6 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                            Library Status
                        </h6>
                        <div className="d-flex gap-4">
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                                    {novels.filter(n => n.status === 'Ongoing').length}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ongoing</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00e676' }}>
                                    {novels.filter(n => n.status === 'Completed').length}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completed</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {novels.length}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h6 style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>Recent Activity</h6>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Novel</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_ACTIVITY.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <Badge style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid rgba(0,229,255,0.2)', fontWeight: 500 }}>
                                            {a.action}
                                        </Badge>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{a.novel}</td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{a.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

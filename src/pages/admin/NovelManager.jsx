import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';

export default function NovelManager() {
    const { novels, dispatch } = useApp();
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const filtered = novels.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.author.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_NOVEL', payload: id });
        setConfirmDelete(null);
    };

    const toggleStatus = (novel) => {
        dispatch({
            type: 'UPDATE_NOVEL',
            payload: { id: novel.id, status: novel.status === 'Ongoing' ? 'Completed' : 'Ongoing' },
        });
    };

    return (
        <AdminLayout title="Manage Novels">
            {/* Top bar */}
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <div className="flex-grow-1" style={{ maxWidth: 360 }}>
                    <div className="search-hero">
                        <span className="search-icon" style={{ fontSize: '0.9rem' }}>🔍</span>
                        <Form.Control
                            type="search"
                            placeholder="Search novels…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                </div>
                <Link to="/admin/novels/new" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>
                    ➕ Add Novel
                </Link>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {filtered.length} novel{filtered.length !== 1 ? 's' : ''} found
            </p>

            {/* Table */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>Cover</th>
                                <th>Title / Author</th>
                                <th>Genres</th>
                                <th>Chapters</th>
                                <th>Status</th>
                                <th>Views</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(novel => (
                                <tr key={novel.id}>
                                    {/* Cover thumbnail */}
                                    <td style={{ width: 56, padding: '0.7rem 0.75rem' }}>
                                        <img
                                            src={novel.cover}
                                            alt={novel.title}
                                            style={{ width: 40, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                            onError={e => { e.target.src = 'https://placehold.co/40x56/1a1a24/00e5ff?text=?'; }}
                                        />
                                    </td>
                                    {/* Title / Author */}
                                    <td style={{ minWidth: 180 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{novel.title}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{novel.author}</div>
                                    </td>
                                    {/* Genres */}
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            {novel.genres.slice(0, 2).map(g => (
                                                <Badge key={g} className="bg-accent" style={{ fontSize: '0.65rem' }}>{g}</Badge>
                                            ))}
                                        </div>
                                    </td>
                                    {/* Chapters */}
                                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                        {novel.chapters.length}
                                    </td>
                                    {/* Status */}
                                    <td>
                                        <button
                                            onClick={() => toggleStatus(novel)}
                                            style={{
                                                background: novel.status === 'Completed' ? 'rgba(0,230,118,0.15)' : 'rgba(0,229,255,0.12)',
                                                color: novel.status === 'Completed' ? '#00e676' : 'var(--accent)',
                                                border: `1px solid ${novel.status === 'Completed' ? 'rgba(0,230,118,0.3)' : 'rgba(0,229,255,0.25)'}`,
                                                borderRadius: 'var(--radius-pill)',
                                                padding: '0.2rem 0.7rem',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all var(--transition-fast)',
                                            }}
                                            title="Click to toggle status"
                                        >
                                            {novel.status}
                                        </button>
                                    </td>
                                    {/* Views */}
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                        {(novel.views / 1000).toFixed(1)}k
                                    </td>
                                    {/* Actions */}
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Link
                                                to={`/novel/${novel.id}`}
                                                target="_blank"
                                                className="btn btn-outline-secondary btn-sm"
                                                style={{ borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                                title="Preview"
                                            >
                                                👁️
                                            </Link>
                                            <Link
                                                to={`/admin/novels/${novel.id}/edit`}
                                                className="btn btn-outline-primary btn-sm"
                                                style={{ borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                                title="Edit"
                                            >
                                                ✏️
                                            </Link>
                                            <Link
                                                to={`/admin/novels/${novel.id}/chapters/new`}
                                                className="btn btn-outline-secondary btn-sm"
                                                style={{ borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                                title="Add Chapter"
                                            >
                                                ➕
                                            </Link>
                                            <button
                                                onClick={() => setConfirmDelete(novel.id)}
                                                className="btn btn-sm"
                                                style={{
                                                    borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem', fontSize: '0.78rem',
                                                    background: 'rgba(255,82,82,0.12)', border: '1px solid rgba(255,82,82,0.25)', color: '#ff8a80',
                                                }}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                                        No novels match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {confirmDelete && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem',
                    }}
                    onClick={() => setConfirmDelete(null)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid rgba(255,82,82,0.3)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '2rem',
                            maxWidth: 380,
                            width: '100%',
                            boxShadow: 'var(--shadow-modal)',
                        }}
                    >
                        <h5 style={{ color: '#ff8a80', marginBottom: '0.75rem' }}>⚠️ Confirm Delete</h5>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            This will permanently remove the novel and all its chapters. This action cannot be undone.
                        </p>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button variant="outline-secondary" size="sm" onClick={() => setConfirmDelete(null)} style={{ borderRadius: 'var(--radius-pill)' }}>
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleDelete(confirmDelete)}
                                style={{
                                    borderRadius: 'var(--radius-pill)',
                                    background: 'rgba(255,82,82,0.15)',
                                    border: '1.5px solid rgba(255,82,82,0.4)',
                                    color: '#ff5252',
                                }}
                            >
                                Delete Permanently
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

export default function NovelCard({ novel, style }) {
    const statusColor = novel.status === 'Completed' ? '#00e676' : 'var(--accent)';

    return (
        <Link to={`/novel/${novel.id}`} style={{ textDecoration: 'none' }}>
            <div className="card novel-card h-100" style={style}>
                {/* Cover Image */}
                <div className="img-wrapper position-relative">
                    <img
                        src={novel.cover && novel.cover.startsWith('/uploads') ? `http://localhost:5000${novel.cover}` : novel.cover}
                        alt={`${novel.title} cover`}
                        className="card-img-top"
                        loading="lazy"
                        style={{ height: 260, objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.src = `https://placehold.co/400x260/1a1a24/00e5ff?text=${encodeURIComponent(novel.title.slice(0, 12))}`;
                        }}
                    />
                    <div className="img-overlay" />
                    {/* Status badge over image */}
                    <span
                        className="badge position-absolute"
                        style={{
                            top: 10,
                            right: 10,
                            background: novel.status === 'Completed' ? 'rgba(0,230,118,0.2)' : 'rgba(0,229,255,0.2)',
                            color: statusColor,
                            border: `1px solid ${statusColor}55`,
                            fontSize: '0.7rem',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        {novel.status}
                    </span>
                </div>

                {/* Body */}
                <div className="card-body d-flex flex-column" style={{ padding: '1rem 1.1rem' }}>
                    <h6
                        className="card-title mb-1"
                        style={{
                            fontSize: '0.97rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {novel.title}
                    </h6>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        by {novel.author}
                    </p>

                    {/* Genres */}
                    <div className="d-flex flex-wrap gap-1 mb-2">
                        {novel.genres.slice(0, 2).map(g => (
                            <Badge key={g} className="bg-accent">{g}</Badge>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {novel.chapters.length} Ch.
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ★ {novel.rating}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {(novel.views / 1000).toFixed(0)}k views
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

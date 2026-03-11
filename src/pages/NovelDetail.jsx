import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import { getReadingProgress } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NovelCard from '../components/NovelCard';

export default function NovelDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getNovelById, novels } = useApp();
    const novel = getNovelById(id);

    if (!novel) {
        return (
            <div className="page-wrapper">
                <Navbar />
                <div className="empty-state" style={{ paddingTop: '8rem' }}>
                    <div className="icon">📚</div>
                    <h3>Novel not found</h3>
                    <Button as={Link} to="/" variant="primary" style={{ borderRadius: 'var(--radius-pill)', marginTop: '1rem' }}>Back Home</Button>
                </div>
            </div>
        );
    }

    const progress = getReadingProgress(novel.id);
    const savedChapter = progress ? novel.chapters.find(c => c.id === progress.chapterId) : null;

    // Similar novels (same genre, exclude self)
    const similar = novels
        .filter(n => n.id !== novel.id && n.genres.some(g => novel.genres.includes(g)))
        .slice(0, 4);

    const firstChapter = novel.chapters[0];
    const startHref = savedChapter
        ? `/novel/${novel.id}/chapter/${savedChapter.id}`
        : firstChapter ? `/novel/${novel.id}/chapter/${firstChapter.id}` : '#';

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>{novel.title} by {novel.author} — BlueNov</title>
                <meta name="description" content={novel.synopsis.slice(0, 155)} />
                <meta property="og:title" content={`${novel.title} — BlueNov`} />
                <meta property="og:description" content={novel.synopsis.slice(0, 155)} />
                <meta property="og:image" content={novel.cover} />
                <meta property="og:type" content="book" />
            </Helmet>

            <Navbar />

            <main className="main-content">
                {/* ── Hero Banner ──────────────────────────── */}
                <div
                    style={{
                        background: `linear-gradient(180deg, rgba(13,13,15,0.1) 0%, var(--bg-primary) 100%), url(${novel.cover}) center/cover no-repeat`,
                        minHeight: 260,
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,15,0.6) 0%, var(--bg-primary) 100%)' }} />
                </div>

                {/* ── Detail Layout ─────────────────────────── */}
                <Container style={{ marginTop: '-120px', position: 'relative', zIndex: 2 }}>
                    <Row className="gy-5">
                        {/* Cover + Actions */}
                        <Col md={3} className="text-center text-md-start animate-fadeInUp">
                            <img
                                src={novel.cover && novel.cover.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || ''}${novel.cover}` : novel.cover}
                                alt={novel.title}
                                loading="lazy"
                                style={{
                                    width: '100%', maxWidth: 220,
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                                    border: '2px solid rgba(255,255,255,0.08)',
                                }}
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/220x330/1a1a24/00e5ff?text=${encodeURIComponent(novel.title.slice(0, 10))}`;
                                }}
                            />

                            <div className="mt-3 d-flex flex-column gap-2">
                                {firstChapter && (
                                    <Button
                                        variant="primary"
                                        style={{ borderRadius: 'var(--radius-pill)' }}
                                        onClick={() => navigate(startHref)}
                                    >
                                        {savedChapter ? '▶ Continue Reading' : '▶ Start Reading'}
                                    </Button>
                                )}
                                {savedChapter && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                        Saved: {savedChapter.title}
                                    </p>
                                )}
                            </div>
                        </Col>

                        {/* Meta */}
                        <Col md={9} className="animate-fadeInUp animate-delay-1">
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <Badge className="bg-accent">{novel.status}</Badge>
                                {novel.genres.map(g => <Badge key={g} bg="secondary" style={{ background: 'var(--bg-elevated) !important', color: 'var(--text-secondary)' }}>{g}</Badge>)}
                            </div>

                            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.3rem' }}>
                                {novel.title}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.2rem', fontSize: '1rem' }}>
                                by <strong style={{ color: 'var(--text-primary)' }}>{novel.author}</strong>
                            </p>

                            {/* Stats row */}
                            <div className="d-flex flex-wrap gap-4 mb-4">
                                {[
                                    { label: 'Chapters', value: novel.chapters.length },
                                    { label: 'Rating', value: `★ ${novel.rating}` },
                                    { label: 'Views', value: `${(novel.views / 1000).toFixed(1)}k` },
                                    { label: 'Updated', value: novel.updatedAt },
                                ].map(stat => (
                                    <div key={stat.label}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Synopsis */}
                            <div style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.25rem 1.5rem',
                                marginBottom: '2rem',
                            }}>
                                <h6 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Synopsis</h6>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, margin: 0 }}>
                                    {novel.synopsis}
                                </p>
                            </div>

                            {/* Chapter List */}
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                                Chapters <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({novel.chapters.length})</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {novel.chapters.map((ch, i) => (
                                    <Link
                                        key={ch.id}
                                        to={`/novel/${novel.id}/chapter/${ch.id}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '0.85rem 1.25rem',
                                                background: savedChapter?.id === ch.id ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                                                border: `1px solid ${savedChapter?.id === ch.id ? 'rgba(0,229,255,0.25)' : 'rgba(255,255,255,0.05)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                transition: 'all var(--transition-fast)',
                                                color: 'var(--text-primary)',
                                            }}
                                            className="chapter-row"
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                            onMouseLeave={e => e.currentTarget.style.background = savedChapter?.id === ch.id ? 'var(--accent-subtle)' : 'var(--bg-surface)'}
                                        >
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, minWidth: 24 }}>{i + 1}</span>
                                            <span style={{ flex: 1, fontWeight: 500, fontSize: '0.92rem' }}>{ch.title}</span>
                                            {savedChapter?.id === ch.id && (
                                                <Badge className="bg-accent" style={{ fontSize: '0.65rem' }}>Saved</Badge>
                                            )}
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                ~{ch.wordCount ? `${ch.wordCount} words` : ''}
                                            </span>
                                            <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Col>
                    </Row>

                    {/* ── Similar Novels ──────────────────────── */}
                    {similar.length > 0 && (
                        <div className="mt-5 pt-3">
                            <hr className="divider mb-4" />
                            <h2 className="section-heading mb-4">
                                <span className="section-dot" /> You Might Also Like
                            </h2>
                            <Row className="g-4">
                                {similar.map(n => (
                                    <Col key={n.id} xs={12} sm={6} md={4} lg={3} style={{ minWidth: 200 }}>
                                        <NovelCard novel={n} />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Container>

                <div style={{ height: '4rem' }} />
            </main>

            <Footer />
        </div>
    );
}

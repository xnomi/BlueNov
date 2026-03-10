import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NovelCard from '../components/NovelCard';

const FEATURED_ID = '1';

export default function Home() {
    const { novels } = useApp();
    const featured = novels.find(n => n.id === FEATURED_ID) || novels[0];
    const recent = [...novels].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);
    const popular = [...novels].sort((a, b) => b.views - a.views).slice(0, 6);

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>BlueNov — Premium Novel Reading Platform</title>
                <meta name="description" content="Discover and read thousands of premium novels for free on BlueNov. Fantasy, Romance, Sci-Fi, Thriller and more — no account required." />
                <meta property="og:title" content="BlueNov — Premium Novel Reading Platform" />
                <meta property="og:description" content="Your premium destination for immersive novel reading." />
                <meta property="og:type" content="website" />
            </Helmet>

            <Navbar />

            <main className="main-content">
                {/* ── Hero ─────────────────────────────────────── */}
                <section className="hero-section">
                    <div className="hero-bg-gradient" />
                    <Container>
                        <Row className="align-items-center gy-5">
                            <Col lg={6} className="animate-fadeInUp">
                                <div className="mb-3 d-flex align-items-center gap-2">
                                    <span className="badge" style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--accent)', border: '1px solid rgba(0,229,255,0.3)', fontSize: '0.75rem' }}>
                                        ✦ Featured Novel
                                    </span>
                                    <span className="badge bg-primary">{featured.status}</span>
                                </div>
                                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
                                    {featured.title}
                                </h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    by <strong style={{ color: 'var(--text-primary)' }}>{featured.author}</strong>
                                </p>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: 500 }}>
                                    {featured.synopsis.slice(0, 180)}…
                                </p>
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {featured.genres.map(g => (
                                        <Badge key={g} className="bg-accent" style={{ padding: '0.4em 0.9em', fontSize: '0.78rem' }}>{g}</Badge>
                                    ))}
                                </div>
                                <div className="d-flex gap-3 flex-wrap">
                                    <Button as={Link} to={`/novel/${featured.id}/chapter/${featured.chapters[0]?.id}`} variant="primary" size="lg" style={{ borderRadius: 'var(--radius-pill)', padding: '0.7rem 2rem' }}>
                                        Start Reading →
                                    </Button>
                                    <Button as={Link} to={`/novel/${featured.id}`} variant="outline-primary" size="lg" style={{ borderRadius: 'var(--radius-pill)', padding: '0.7rem 1.5rem' }}>
                                        Novel Details
                                    </Button>
                                </div>

                                {/* Mini stats */}
                                <div className="d-flex gap-4 mt-4">
                                    {[
                                        { label: 'Chapters', value: featured.chapters.length },
                                        { label: 'Rating', value: `★ ${featured.rating}` },
                                        { label: 'Views', value: `${(featured.views / 1000).toFixed(0)}k` },
                                    ].map(s => (
                                        <div key={s.label}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            <Col lg={6} className="text-center animate-fadeInUp animate-delay-2">
                                <img
                                    src={featured.cover}
                                    alt={featured.title}
                                    className="hero-cover"
                                    loading="eager"
                                    onError={(e) => {
                                        e.target.src = `https://placehold.co/350x500/1a1a24/00e5ff?text=${encodeURIComponent(featured.title.slice(0, 10))}`;
                                    }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </section>

                <hr className="divider" />

                {/* ── Recently Added ──────────────────────── */}
                <section className="section-padded">
                    <Container>
                        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                            <h2 className="section-heading mb-0">
                                <span className="section-dot" /> Recently Added
                            </h2>
                            <Button as={Link} to="/discover" variant="outline-secondary" size="sm" style={{ borderRadius: 'var(--radius-pill)' }}>
                                View All →
                            </Button>
                        </div>
                        <Row className="g-4">
                            {recent.map((novel, i) => (
                                <Col key={novel.id} xs={12} sm={6} md={4} lg={3} xl={2} style={{ minWidth: 200 }}
                                    className={`animate-fadeInUp animate-delay-${Math.min(i + 1, 4)}`}>
                                    <NovelCard novel={novel} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                <hr className="divider" />

                {/* ── Most Popular ────────────────────────── */}
                <section className="section-padded">
                    <Container>
                        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                            <h2 className="section-heading mb-0">
                                <span className="section-dot" style={{ background: 'var(--blue)', boxShadow: '0 0 10px var(--blue)' }} />
                                Most&nbsp;Popular
                            </h2>
                            <Button as={Link} to="/discover" variant="outline-secondary" size="sm" style={{ borderRadius: 'var(--radius-pill)' }}>
                                View All →
                            </Button>
                        </div>
                        <Row className="g-4">
                            {popular.map((novel, i) => (
                                <Col key={novel.id} xs={12} sm={6} md={4} lg={3} xl={2} style={{ minWidth: 200 }}
                                    className={`animate-fadeInUp animate-delay-${Math.min(i + 1, 4)}`}>
                                    <NovelCard novel={novel} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* ── CTA Banner ──────────────────────────── */}
                <section style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(41,121,255,0.08) 100%)', borderTop: '1px solid rgba(0,229,255,0.12)', borderBottom: '1px solid rgba(0,229,255,0.12)', padding: '3.5rem 0' }}>
                    <Container className="text-center">
                        <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '1rem' }}>
                            Hundreds of Stories. <span className="gradient-text">All Free.</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 2rem', fontSize: '1.05rem' }}>
                            No account. No subscriptions. Just pick a novel and start reading — your progress saves automatically.
                        </p>
                        <Button as={Link} to="/discover" variant="primary" size="lg" style={{ borderRadius: 'var(--radius-pill)', padding: '0.75rem 2.5rem' }}>
                            Explore Library →
                        </Button>
                    </Container>
                </section>
            </main>

            <Footer />
        </div>
    );
}

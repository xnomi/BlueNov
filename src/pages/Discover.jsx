import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NovelCard from '../components/NovelCard';
import { GENRES } from '../data/mockData';

const ALL_GENRES = ['All', ...GENRES];
const STATUSES = ['All', 'Ongoing', 'Completed'];

export default function Discover() {
    const { novels, searchQuery, selectedGenre, selectedStatus, filteredNovels, dispatch } = useApp();

    const [localQuery, setLocalQuery] = useState(searchQuery);

    const handleSearch = (e) => {
        const val = e.target.value;
        setLocalQuery(val);
        dispatch({ type: 'SET_SEARCH', payload: val });
    };

    const handleGenre = (genre) => dispatch({ type: 'SET_GENRE', payload: genre });
    const handleStatus = (status) => dispatch({ type: 'SET_STATUS', payload: status });

    const clearFilters = () => {
        setLocalQuery('');
        dispatch({ type: 'SET_SEARCH', payload: '' });
        dispatch({ type: 'SET_GENRE', payload: 'All' });
        dispatch({ type: 'SET_STATUS', payload: 'All' });
    };

    const isFiltered = localQuery || selectedGenre !== 'All' || selectedStatus !== 'All';

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>Discover Novels — BlueNov</title>
                <meta name="description" content={`Explore ${novels.length}+ novels across Fantasy, Romance, Sci-Fi, Mystery and more. Filter by genre, author, and status on BlueNov.`} />
            </Helmet>

            <Navbar />

            <main className="main-content">
                {/* ── Header ──────────────────────────────── */}
                <div style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', padding: '3rem 0 2rem' }}>
                    <Container>
                        <div className="animate-fadeInUp">
                            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
                                Discover <span className="gradient-text">Novels</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                {novels.length} novels available. Free to read, no account required.
                            </p>

                            {/* Search */}
                            <div className="search-hero" style={{ maxWidth: 520 }}>
                                <span className="search-icon">🔍</span>
                                <Form.Control
                                    type="search"
                                    placeholder="Search by title or author…"
                                    value={localQuery}
                                    onChange={handleSearch}
                                    aria-label="Search novels"
                                />
                            </div>
                        </div>
                    </Container>
                </div>

                {/* ── Filters ─────────────────────────────── */}
                <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.85rem 0', position: 'sticky', top: 60, zIndex: 50 }}>
                    <Container>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>GENRE:</span>
                            <div className="d-flex gap-2 flex-wrap">
                                {ALL_GENRES.map(g => (
                                    <button
                                        key={g}
                                        className={`genre-pill ${selectedGenre === g ? 'active' : ''}`}
                                        onClick={() => handleGenre(g)}
                                        aria-pressed={selectedGenre === g}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                            <div className="ms-md-auto d-flex align-items-center gap-2 mt-2 mt-md-0">
                                <Form.Select
                                    value={selectedStatus}
                                    onChange={e => handleStatus(e.target.value)}
                                    style={{ width: 'auto', minWidth: 120, padding: '0.3rem 0.8rem', fontSize: '0.83rem' }}
                                    aria-label="Filter by status"
                                >
                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                </Form.Select>
                                {isFiltered && (
                                    <Button variant="outline-secondary" size="sm" onClick={clearFilters} style={{ borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>
                                        ✕ Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>

                {/* ── Results ─────────────────────────────── */}
                <section className="section-padded">
                    <Container>
                        {filteredNovels.length > 0 ? (
                            <>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredNovels.length}</strong> result{filteredNovels.length !== 1 ? 's' : ''}
                                </p>
                                <Row className="g-4">
                                    {filteredNovels.map((novel, i) => (
                                        <Col key={novel.id} xs={12} sm={6} md={4} lg={3} xl={2} style={{ minWidth: 210 }}
                                            className={`animate-fadeInUp animate-delay-${Math.min(i % 4 + 1, 4)}`}>
                                            <NovelCard novel={novel} />
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="icon">📚</div>
                                <h4 style={{ color: 'var(--text-secondary)' }}>No novels found</h4>
                                <p>Try adjusting your search or filters.</p>
                                <Button variant="outline-primary" onClick={clearFilters} style={{ borderRadius: 'var(--radius-pill)' }}>
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </Container>
                </section>
            </main>

            <Footer />
        </div>
    );
}

import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import { saveReadingProgress } from '../context/AppContext';

const FONT_SIZES = ['sm', 'md', 'lg', 'xl'];
const FONTS = [
    { key: 'inter', label: 'Sans' },
    { key: 'merriweather', label: 'Serif' },
];

export default function ReadingPage() {
    const { id, chapterId } = useParams();
    const navigate = useNavigate();
    const { getNovelById } = useApp();
    const novel = getNovelById(id);

    const [fontSize, setFontSize] = useState(() => localStorage.getItem('bluenov_fontsize') || 'md');
    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('bluenov_fontfamily') || 'inter');
    const [scrollPct, setScrollPct] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const lastScrollY = useRef(0);

    const chapter = novel?.chapters.find(c => c.id === chapterId);
    const chapIdx = novel ? novel.chapters.findIndex(c => c.id === chapterId) : -1;
    const prevChap = chapIdx > 0 ? novel.chapters[chapIdx - 1] : null;
    const nextChap = chapIdx < (novel?.chapters.length - 1) ? novel.chapters[chapIdx + 1] : null;

    // Auto-save progress
    useEffect(() => {
        if (id && chapterId) saveReadingProgress(id, chapterId);
    }, [id, chapterId]);

    // Persist reading preferences
    useEffect(() => { localStorage.setItem('bluenov_fontsize', fontSize); }, [fontSize]);
    useEffect(() => { localStorage.setItem('bluenov_fontfamily', fontFamily); }, [fontFamily]);

    // Reading progress bar + hide/show toolbar on scroll
    const handleScroll = useCallback(() => {
        const el = document.documentElement;
        const scrolled = el.scrollTop;
        const total = el.scrollHeight - el.clientHeight;
        setScrollPct(total > 0 ? (scrolled / total) * 100 : 0);

        // Auto-hide controls on scroll down
        if (scrolled > lastScrollY.current + 20) setShowControls(false);
        else if (scrolled < lastScrollY.current - 10) setShowControls(true);
        lastScrollY.current = scrolled;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [chapterId, handleScroll]);

    if (!novel || !chapter) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Chapter not found.</p>
                <Button as={Link} to="/" variant="primary" style={{ borderRadius: 'var(--radius-pill)' }}>Back Home</Button>
            </div>
        );
    }

    const cycleSize = () => {
        const idx = FONT_SIZES.indexOf(fontSize);
        setFontSize(FONT_SIZES[(idx + 1) % FONT_SIZES.length]);
    };

    const toggleFont = () => {
        setFontFamily(f => (f === 'inter' ? 'merriweather' : 'inter'));
    };

    const SIZE_LABELS = { sm: 'S', md: 'M', lg: 'L', xl: 'XL' };

    return (
        <div style={{ background: 'var(--bg-primary)' }}>
            <Helmet>
                <title>{chapter.title} — {novel.title} | BlueNov</title>
                <meta name="description" content={`Read "${chapter.title}" from ${novel.title} by ${novel.author} on BlueNov. Free immersive reading experience.`} />
            </Helmet>

            {/* ── Reading Toolbar ──────────────────────── */}
            <div
                className="reading-toolbar"
                style={{
                    transform: showControls ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease',
                }}
            >
                {/* Progress bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <div className="progress-bar-reading" style={{ width: `${scrollPct}%` }} />
                </div>

                <div className="container">
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        {/* Back */}
                        <Button
                            as={Link}
                            to={`/novel/${novel.id}`}
                            variant="outline-secondary"
                            size="sm"
                            style={{ borderRadius: 'var(--radius-pill)', padding: '0.3rem 0.9rem', fontSize: '0.8rem', flexShrink: 0 }}
                        >
                            ← Novel
                        </Button>

                        {/* Breadcrumb */}
                        <div className="flex-grow-1 text-center d-none d-sm-block">
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                {novel.title}
                            </span>
                            <span style={{ color: 'var(--text-muted)', margin: '0 0.4rem' }}>›</span>
                            <span style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 600 }}>
                                {chapter.title}
                            </span>
                        </div>

                        {/* Controls */}
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                            {/* Font size */}
                            <button
                                onClick={cycleSize}
                                title="Toggle font size"
                                style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-secondary)',
                                    padding: '0.3rem 0.7rem',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                {SIZE_LABELS[fontSize]}
                            </button>
                            {/* Font family */}
                            <button
                                onClick={toggleFont}
                                title="Toggle font family"
                                style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 'var(--radius-md)',
                                    color: fontFamily === 'merriweather' ? 'var(--accent)' : 'var(--text-secondary)',
                                    padding: '0.3rem 0.7rem',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: fontFamily === 'merriweather' ? 700 : 400,
                                    fontFamily: fontFamily === 'merriweather' ? 'Merriweather, serif' : 'Inter, sans-serif',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                {FONTS.find(f => f.key === fontFamily)?.label}
                            </button>
                            {/* Progress */}
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 36 }}>
                                {Math.round(scrollPct)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Chapter Content ──────────────────────── */}
            <div
                className={`reading-content font-${fontFamily} size-${fontSize}`}
                style={{ paddingTop: '5rem' }}
            >
                {/* Chapter header */}
                <div className="text-center mb-5">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Chapter {chapIdx + 1} of {novel.chapters.length}
                    </p>
                    <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {chapter.title}
                    </h1>
                    <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>
                        {novel.title} · {novel.author}
                    </p>
                    <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '2rem auto', maxWidth: 200 }} />
                </div>

                {/* Chapter text */}
                <div style={{ color: 'var(--text-secondary)' }}>
                    {chapter.content.split('\n\n').map((para, i) => (
                        para.trim() && (
                            <p key={i} style={{ marginBottom: '1.5em' }}>
                                {para.trim()}
                            </p>
                        )
                    ))}
                </div>

                {/* End of chapter */}
                <div className="text-center mt-5 pt-3">
                    <hr style={{ borderColor: 'rgba(255,255,255,0.06)', maxWidth: 200, margin: '0 auto 2rem' }} />
                    {nextChap ? (
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Up next:</p>
                            <h5 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{nextChap.title}</h5>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You've reached the end of available chapters.</p>
                    )}
                </div>
            </div>

            {/* ── Bottom Navigation Bar ───────────────── */}
            <div className="reading-nav-bar">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                        {prevChap ? (
                            <Button
                                onClick={() => navigate(`/novel/${novel.id}/chapter/${prevChap.id}`)}
                                variant="outline-secondary"
                                size="sm"
                                style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 1.1rem', flexShrink: 0 }}
                            >
                                ← Prev
                            </Button>
                        ) : (
                            <Button variant="outline-secondary" size="sm" disabled style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 1.1rem', opacity: 0.3 }}>
                                ← Prev
                            </Button>
                        )}

                        {/* Chapter indicator */}
                        <div className="text-center flex-grow-1">
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                                {chapIdx + 1} / {novel.chapters.length}
                            </div>
                            {/* Mini progress dots */}
                            <div className="d-flex justify-content-center gap-1">
                                {novel.chapters.slice(0, Math.min(novel.chapters.length, 10)).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: i === chapIdx ? 16 : 5,
                                            height: 5,
                                            borderRadius: 'var(--radius-pill)',
                                            background: i === chapIdx ? 'var(--accent)' : 'var(--bg-elevated)',
                                            transition: 'all var(--transition-smooth)',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {nextChap ? (
                            <Button
                                onClick={() => navigate(`/novel/${novel.id}/chapter/${nextChap.id}`)}
                                variant="primary"
                                size="sm"
                                style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 1.1rem', flexShrink: 0 }}
                            >
                                Next →
                            </Button>
                        ) : (
                            <Button
                                as={Link}
                                to={`/novel/${novel.id}`}
                                variant="outline-primary"
                                size="sm"
                                style={{ borderRadius: 'var(--radius-pill)', padding: '0.45rem 1.1rem', flexShrink: 0 }}
                            >
                                Finish ✓
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

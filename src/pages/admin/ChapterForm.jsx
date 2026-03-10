import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';

export default function ChapterForm() {
    const { id } = useParams(); // novel id
    const navigate = useNavigate();
    const { getNovelById, dispatch } = useApp();
    const novel = getNovelById(id);

    const [form, setForm] = useState({ title: '', content: '' });
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!novel) {
        return (
            <AdminLayout title="Add Chapter">
                <Alert variant="danger">Novel not found.</Alert>
            </AdminLayout>
        );
    }

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: undefined }));
    };

    const wordCount = form.content.trim()
        ? form.content.trim().split(/\s+/).length
        : 0;

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Chapter title is required';
        if (!form.content.trim()) e.content = 'Chapter content cannot be empty';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        const newChapter = {
            id: `c${Date.now()}`,
            title: form.title.trim(),
            content: form.content,
            wordCount,
        };

        try {
            const res = await fetch(`http://localhost:5000/api/novels/${novel.id}/chapters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newChapter)
            });

            if (!res.ok) throw new Error('Failed to save chapter');
            const savedChapter = await res.json();

            dispatch({
                type: 'ADD_CHAPTER',
                payload: {
                    novelId: novel.id,
                    chapter: savedChapter,
                },
            });
            setSaved(true);
            setTimeout(() => navigate(`/admin/novels/${novel.id}/edit`), 1500);
        } catch (error) {
            console.error(error);
            setErrors({ submit: 'Failed to save chapter to server.' });
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout title={`Add Chapter — ${novel.title}`}>
            <div style={{ maxWidth: 780 }}>
                {saved && (
                    <Alert variant="success" className="mb-4 py-2">
                        ✅ Chapter added successfully! Redirecting…
                    </Alert>
                )}

                <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                    {/* Novel context */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--accent-subtle)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(0,229,255,0.2)',
                    }}>
                        <span style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 500 }}>
                            📚 Adding chapter to: <strong>{novel.title}</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '0.75rem' }}>
                            ({novel.chapters.length} existing chapter{novel.chapters.length !== 1 ? 's' : ''})
                        </span>
                    </div>

                    <Form onSubmit={handleSubmit} noValidate>
                        <Row className="g-3">
                            {/* Chapter title */}
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Chapter Title *</Form.Label>
                                    <Form.Control
                                        id="chapter-title"
                                        type="text"
                                        placeholder="e.g. The Awakening, Chapter 4"
                                        value={form.title}
                                        onChange={e => set('title', e.target.value)}
                                        isInvalid={!!errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Content */}
                            <Col xs={12}>
                                <Form.Group>
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <Form.Label className="mb-0">Chapter Content *</Form.Label>
                                        {wordCount > 0 && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {wordCount.toLocaleString()} words · ~{Math.ceil(wordCount / 200)} min read
                                            </span>
                                        )}
                                    </div>
                                    <Form.Control
                                        id="chapter-content"
                                        as="textarea"
                                        rows={20}
                                        placeholder="Paste or type the chapter content here. Separate paragraphs with a blank line…"
                                        value={form.content}
                                        onChange={e => set('content', e.target.value)}
                                        isInvalid={!!errors.content}
                                        style={{
                                            fontFamily: 'Merriweather, serif',
                                            fontSize: '0.93rem',
                                            lineHeight: 1.85,
                                            resize: 'vertical',
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
                                    <Form.Text style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                                        Use a blank line between paragraphs for proper formatting in the reader.
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            {/* Preview note */}
                            {form.content.trim() && (
                                <Col xs={12}>
                                    <div style={{
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '1rem 1.25rem',
                                        maxHeight: 200,
                                        overflowY: 'auto',
                                    }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</p>
                                        {form.content.split('\n\n').slice(0, 3).filter(Boolean).map((p, i) => (
                                            <p key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.75em' }}>
                                                {p.trim().slice(0, 300)}{p.trim().length > 300 ? '…' : ''}
                                            </p>
                                        ))}
                                    </div>
                                </Col>
                            )}

                            {/* Actions */}
                            <Col xs={12} className="d-flex gap-2 mt-1">
                                <Button type="submit" variant="primary" disabled={isSubmitting} style={{ borderRadius: 'var(--radius-pill)', paddingInline: '2rem' }}>
                                    {isSubmitting ? 'Publishing...' : '✅ Publish Chapter'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => navigate(`/admin/novels/${novel.id}/edit`)}
                                    style={{ borderRadius: 'var(--radius-pill)' }}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}

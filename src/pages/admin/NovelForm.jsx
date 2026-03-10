import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { GENRES } from '../../data/mockData';

const DEFAULT_NOVEL = {
    title: '', author: '', cover: '', synopsis: '',
    genres: [], status: 'Ongoing',
};

export default function NovelForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getNovelById, dispatch } = useApp();

    const isEdit = !!id;
    const existing = isEdit ? getNovelById(id) : null;

    const [form, setForm] = useState(existing || DEFAULT_NOVEL);
    const [coverFile, setCoverFile] = useState(null);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existing) setForm(existing);
    }, [id]);

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setErrors(e => ({ ...e, [field]: undefined }));
    };

    const toggleGenre = (genre) => {
        setForm(f => ({
            ...f,
            genres: f.genres.includes(genre)
                ? f.genres.filter(g => g !== genre)
                : [...f.genres, genre],
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.author.trim()) e.author = 'Author is required';
        if (!form.synopsis.trim()) e.synopsis = 'Synopsis is required';
        if (form.genres.length === 0) e.genres = 'Select at least one genre';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('author', form.author);
        formData.append('synopsis', form.synopsis);
        formData.append('status', form.status);
        formData.append('genres', JSON.stringify(form.genres));

        // If there's an existing cover URL and we aren't uploading a new file, retain it.
        if (form.cover) formData.append('cover', form.cover);

        if (coverFile) {
            formData.append('coverImage', coverFile);
        }

        try {
            const url = isEdit ? `http://localhost:5000/api/novels/${form.id}` : 'http://localhost:5000/api/novels';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                body: formData
            });

            if (!res.ok) throw new Error('Failed to save novel');

            const savedNovel = await res.json();

            if (isEdit) {
                dispatch({ type: 'UPDATE_NOVEL', payload: savedNovel });
            } else {
                dispatch({ type: 'ADD_NOVEL', payload: savedNovel });
            }

            setSaved(true);
            setTimeout(() => navigate('/admin/novels'), 1500);
        } catch (error) {
            console.error(error);
            setErrors({ submit: 'Failed to communicate with the server.' });
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit: ${form.title || 'Novel'}` : 'Add New Novel'}>
            <div style={{ maxWidth: 700 }}>
                {saved && (
                    <Alert variant="success" className="mb-4 py-2">
                        ✅ Novel {isEdit ? 'updated' : 'added'} successfully! Redirecting…
                    </Alert>
                )}

                <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Row className="g-3">
                            {/* Title */}
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Title *</Form.Label>
                                    <Form.Control
                                        id="novel-title"
                                        type="text"
                                        placeholder="Enter novel title"
                                        value={form.title}
                                        onChange={e => set('title', e.target.value)}
                                        isInvalid={!!errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Author */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Author *</Form.Label>
                                    <Form.Control
                                        id="novel-author"
                                        type="text"
                                        placeholder="Author name"
                                        value={form.author}
                                        onChange={e => set('author', e.target.value)}
                                        isInvalid={!!errors.author}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Status */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        id="novel-status"
                                        value={form.status}
                                        onChange={e => set('status', e.target.value)}
                                    >
                                        <option>Ongoing</option>
                                        <option>Completed</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* Cover Upload */}
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Cover Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setCoverFile(e.target.files[0]);
                                                // Create local preview URL for UX
                                                set('cover', URL.createObjectURL(e.target.files[0]));
                                            }
                                        }}
                                        style={{ background: 'rgba(255,255,255,0.03)' }}
                                    />
                                    <Form.Text className="text-muted" style={{ fontSize: '0.8rem' }}>
                                        Upload a local image, or leave blank/unchanged.
                                    </Form.Text>
                                    {form.cover && (
                                        <div className="mt-2">
                                            <img
                                                src={form.cover.startsWith('blob:') ? form.cover : `http://localhost:5000${form.cover}`}
                                                alt="Preview"
                                                style={{ height: 100, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>

                            {/* Synopsis */}
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Synopsis *</Form.Label>
                                    <Form.Control
                                        id="novel-synopsis"
                                        as="textarea"
                                        rows={4}
                                        placeholder="Write a compelling synopsis…"
                                        value={form.synopsis}
                                        onChange={e => set('synopsis', e.target.value)}
                                        isInvalid={!!errors.synopsis}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.synopsis}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Genres */}
                            <Col xs={12}>
                                <Form.Label>Genres * {errors.genres && <span style={{ color: '#ff8a80', fontSize: '0.78rem' }}>{errors.genres}</span>}</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {GENRES.map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            className={`genre-pill ${form.genres.includes(g) ? 'active' : ''}`}
                                            onClick={() => toggleGenre(g)}
                                            aria-pressed={form.genres.includes(g)}
                                        >
                                            {form.genres.includes(g) ? '✓ ' : ''}{g}
                                        </button>
                                    ))}
                                </div>
                            </Col>

                            {/* Actions */}
                            <Col xs={12} className="d-flex gap-2 mt-2">
                                <Button type="submit" variant="primary" disabled={isSubmitting} style={{ borderRadius: 'var(--radius-pill)', paddingInline: '2rem' }}>
                                    {isSubmitting ? 'Saving...' : (isEdit ? '💾 Save Changes' : '✅ Publish Novel')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => navigate('/admin/novels')}
                                    style={{ borderRadius: 'var(--radius-pill)' }}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Chapters section (edit mode only) */}
                {isEdit && existing && (
                    <div className="mt-4" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h6 style={{ margin: 0, fontWeight: 600 }}>Chapters ({existing.chapters.length})</h6>
                            <Button
                                as="a"
                                href={`/admin/novels/${id}/chapters/new`}
                                variant="primary"
                                size="sm"
                                style={{ borderRadius: 'var(--radius-pill)' }}
                            >
                                ➕ Add Chapter
                            </Button>
                        </div>
                        {existing.chapters.length > 0 ? (
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Chapter Title</th>
                                        <th>Words</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {existing.chapters.map((ch, i) => (
                                        <tr key={ch.id}>
                                            <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{ch.title}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{ch.wordCount || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', padding: '1.5rem', margin: 0, fontSize: '0.88rem' }}>
                                No chapters yet. Add the first chapter!
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

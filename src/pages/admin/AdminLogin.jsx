import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/images/bluenovlogo.png';

export default function AdminLogin() {
    const { adminLogin } = useApp();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 500)); // simulate auth delay
        const success = adminLogin(credentials.username, credentials.password);
        setLoading(false);
        if (success) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Helmet>
                <title>Admin Login — BlueNov</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Background glow */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,229,255,0.05) 0%, transparent 70%)',
            }} />

            <div className="login-card animate-fadeInUp" style={{ width: '100%', maxWidth: 420, zIndex: 1 }}>
                {/* Logo */}
                <div className="text-center mb-4">
                    <img src={logo} alt="BlueNov" height="48" className="mb-2" />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Admin Panel</p>
                    <div style={{
                        width: 40, height: 2,
                        background: 'linear-gradient(90deg, var(--accent), var(--blue))',
                        margin: '0.75rem auto 0',
                        borderRadius: 'var(--radius-pill)',
                    }} />
                </div>

                <h4 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '2rem', fontSize: '1.2rem' }}>
                    Sign In to Continue
                </h4>

                {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            id="admin-username"
                            type="text"
                            placeholder="Enter username"
                            value={credentials.username}
                            onChange={e => setCredentials(c => ({ ...c, username: e.target.value }))}
                            required
                            autoComplete="username"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            id="admin-password"
                            type="password"
                            placeholder="Enter password"
                            value={credentials.password}
                            onChange={e => setCredentials(c => ({ ...c, password: e.target.value }))}
                            required
                            autoComplete="current-password"
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={loading}
                        style={{ padding: '0.75rem', fontSize: '0.95rem' }}
                        id="admin-login-btn"
                    >
                        {loading ? (
                            <span className="d-flex align-items-center justify-content-center gap-2">
                                <div className="spinner-bluenov" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Signing in…
                            </span>
                        ) : 'Sign In →'}
                    </Button>
                </Form>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1.5rem', marginBottom: 0 }}>
                    🔒 This area is restricted to administrators only.
                </p>
            </div>
        </div>
    );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Form, InputGroup, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/images/bluenovlogo.png';

export default function SiteNavbar() {
    const { dispatch, adminAuth } = useApp();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_SEARCH', payload: query.trim() });
        navigate('/discover');
    };

    return (
        <Navbar className="navbar-bluenov" expand="md" sticky="top">
            <Container>
                {/* Brand */}
                <Navbar.Brand as={Link} to="/" className="navbar-brand-logo me-4 d-flex align-items-center gap-2">
                    <img src={logo} alt="BlueNov Logo" height="28" />
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Poppins, sans-serif' }}>
                        <span className="gradient-text">Blue</span>
                        <span style={{ color: 'var(--text-primary)' }}>Nov</span>
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="main-nav"
                    style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--text-secondary)' }}
                />

                <Navbar.Collapse id="main-nav">
                    {/* Left links */}
                    <Nav className="me-auto align-items-center gap-1">
                        <Nav.Link as={NavLink} to="/" className="nav-link-custom" end>
                            Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/discover" className="nav-link-custom">
                            Discover
                        </Nav.Link>
                        {adminAuth && (
                            <Nav.Link as={NavLink} to="/admin/dashboard" className="nav-link-custom">
                                Admin ✦
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* Search */}
                    <Form className="d-flex" onSubmit={handleSearch} style={{ maxWidth: 280 }}>
                        <InputGroup>
                            <Form.Control
                                type="search"
                                placeholder="Search novels…"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1.5px solid rgba(255,255,255,0.08)',
                                    color: 'var(--text-primary)',
                                    borderRadius: 'var(--radius-pill) 0 0 var(--radius-pill)',
                                    fontSize: '0.88rem',
                                }}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                style={{ borderRadius: '0 var(--radius-pill) var(--radius-pill) 0', padding: '0 1rem' }}
                            >
                                🔍
                            </Button>
                        </InputGroup>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

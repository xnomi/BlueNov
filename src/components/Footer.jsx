import { Link } from 'react-router-dom';
import footerLogo from '../assets/images/bluenovfooterlogo.png';

export default function Footer() {
    return (
        <footer className="footer-bluenov">
            <div className="container">
                <div className="row gy-3 align-items-center">
                    <div className="col-md-4">
                        <div className="h5 mb-1">
                            <img src={footerLogo} alt="BlueNov" height="36" />
                        </div>
                        <p className="mb-0" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Your premium destination for immersive novel reading.
                        </p>
                    </div>
                    <div className="col-md-4 text-md-center">
                        <div className="d-flex gap-3 justify-content-md-center flex-wrap">
                            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Home</Link>
                            <Link to="/discover" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Discover</Link>
                            <Link to="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Admin</Link>
                        </div>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <p className="mb-0" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            © {new Date().getFullYear()} BlueNov. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function LoadingSpinner({ fullPage = false }) {
    if (fullPage) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-primary)',
                }}
            >
                <div className="text-center">
                    <div className="spinner-bluenov mx-auto mb-3"></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</p>
                </div>
            </div>
        );
    }
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-bluenov"></div>
        </div>
    );
}

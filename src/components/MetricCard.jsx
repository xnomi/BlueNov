export default function MetricCard({ icon, label, value, color = 'var(--accent)', delay = 0 }) {
    return (
        <div className="metric-card animate-fadeInUp" style={{ animationDelay: `${delay}ms` }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="metric-icon" style={{ background: `${color}18`, color }}>
                    {icon}
                </div>
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-label mt-1">{label}</div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0, right: 0,
                    width: 80, height: 80,
                    borderRadius: '50%',
                    background: `${color}08`,
                    transform: 'translate(20px, 20px)',
                }}
            />
        </div>
    );
}

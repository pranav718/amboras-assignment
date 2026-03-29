'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delay?: number; 
}

export default function MetricCard({
  title,
  value,
  subtitle,
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className={`dashboard-card animate-in ${delay ? `animate-delay-${delay}` : ''}`}
      style={{ padding: '32px 24px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p
          style={{
            fontSize: '13px',
            color: '#A3A3A3',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: '32px',
            color: '#FFFFFF',
            letterSpacing: '-1px',
            lineHeight: 1,
            fontWeight: 600,
            marginTop: '8px',
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p
            style={{
              fontSize: '13px',
              color: '#6F6F6F',
              marginTop: '12px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

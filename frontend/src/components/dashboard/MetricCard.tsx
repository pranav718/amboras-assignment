'use client';


interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconClass: string; 
  delay?: number; 
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className={`glass-card gradient-border animate-in ${delay ? `animate-delay-${delay}` : ''}`}
      style={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {}
        <div
          className={iconClass}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              marginBottom: '4px',
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '4px',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

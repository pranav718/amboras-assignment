'use client';

import type { RecentEvent } from '@/lib/types';


interface RecentActivityProps {
  data: RecentEvent[];
  loading?: boolean;
}

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Page View',
  add_to_cart: 'Added to Cart',
  remove_from_cart: 'Removed from Cart',
  checkout_started: 'Checkout Started',
  purchase: 'Purchase',
};

const EVENT_ICONS: Record<string, string> = {
  page_view: '',
  add_to_cart: '',
  remove_from_cart: '',
  checkout_started: '',
  purchase: '',
};


function timeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}

export default function RecentActivity({ data, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="glass-card animate-in" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Recent Activity</h3>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '48px', marginBottom: '8px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card animate-in animate-delay-4" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600 }}> Recent Activity</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>Auto-updating</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
          No recent events
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {data.map((event) => (
            <div
              key={event.event_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {}
              <span style={{ fontSize: '16px' }}>
                {EVENT_ICONS[event.event_type] || ''}
              </span>

              {}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span className={`badge badge-${event.event_type}`}>
                    {EVENT_LABELS[event.event_type] || event.event_type}
                  </span>
                  {event.event_type === 'purchase' && event.data?.amount && (
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-green)' }}>
                      +${event.data.amount.toFixed(2)}
                    </span>
                  )}
                </div>
                {event.data?.product_name && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.data.product_name}
                  </p>
                )}
              </div>

              {}
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                {timeAgo(event.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

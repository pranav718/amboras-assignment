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
      <div className="dashboard-card animate-in" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>Activity Feed</h3>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '48px', marginBottom: '16px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-card animate-in animate-delay-4" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}> Activity Feed</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF' }} />
          <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 500 }}>Live Sync</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#6F6F6F', fontSize: '14px' }}>
          No recent events
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
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
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#111111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span className={`badge badge-${event.event_type}`}>
                    {EVENT_LABELS[event.event_type] || event.event_type}
                  </span>
                  {event.event_type === 'purchase' && event.data?.amount && (
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      +${event.data.amount.toFixed(2)}
                    </span>
                  )}
                </div>
                {event.data?.product_name && (
                  <p style={{ fontSize: '13px', color: '#A3A3A3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.data.product_name}
                  </p>
                )}
              </div>

              <span style={{ fontSize: '12px', color: '#6F6F6F', flexShrink: 0 }}>
                {timeAgo(event.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

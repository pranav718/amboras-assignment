'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { OverviewResponse } from '@/lib/types';


interface EventBreakdownProps {
  data?: OverviewResponse;
  loading?: boolean;
}

const EVENT_COLORS: Record<string, string> = {
  page_views: '#06b6d4',
  add_to_cart: '#818cf8',
  remove_from_cart: '#ef4444',
  checkout_started: '#f59e0b',
  purchases: '#10b981',
};

const EVENT_LABELS: Record<string, string> = {
  page_views: 'Page Views',
  add_to_cart: 'Add to Cart',
  remove_from_cart: 'Remove from Cart',
  checkout_started: 'Checkout Started',
  purchases: 'Purchases',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{EVENT_LABELS[name] || name}</p>
      <p style={{ fontSize: '16px', fontWeight: 700 }}>{value.toLocaleString()}</p>
    </div>
  );
};

export default function EventTypeBreakdown({ data, loading }: EventBreakdownProps) {
  if (loading || !data) {
    return (
      <div className="glass-card animate-in" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Event Breakdown</h3>
        <div className="skeleton" style={{ height: '280px' }} />
      </div>
    );
  }

  const chartData = [
    { name: 'page_views', value: data.events.page_views },
    { name: 'add_to_cart', value: data.events.add_to_cart },
    { name: 'remove_from_cart', value: data.events.remove_from_cart },
    { name: 'checkout_started', value: data.events.checkout_started },
    { name: 'purchases', value: data.events.purchases },
  ].filter((d) => d.value > 0); 

  return (
    <div className="glass-card animate-in animate-delay-3" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Event Breakdown</h3>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={EVENT_COLORS[entry.name] || '#6366f1'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {chartData.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  background: EVENT_COLORS[item.name],
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {EVENT_LABELS[item.name]}
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

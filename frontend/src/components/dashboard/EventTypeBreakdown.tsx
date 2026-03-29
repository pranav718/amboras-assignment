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
  page_views: '#333333',
  add_to_cart: '#6F6F6F',
  remove_from_cart: '#DC2626',
  checkout_started: '#A3A3A3',
  purchases: '#FFFFFF',
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
        background: '#000000',
        border: '1px solid #333333',
        borderRadius: '4px',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-video)',
      }}
    >
      <p style={{ fontSize: '13px', color: '#A3A3A3', marginBottom: '4px' }}>{EVENT_LABELS[name] || name}</p>
      <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>{value.toLocaleString()}</p>
    </div>
  );
};

export default function EventTypeBreakdown({ data, loading }: EventBreakdownProps) {
  if (loading || !data) {
    return (
      <div className="dashboard-card animate-in" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>Event Breakdown</h3>
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
    <div className="dashboard-card animate-in animate-delay-3" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>Event Breakdown</h3>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={EVENT_COLORS[entry.name] || '#FFFFFF'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        {chartData.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: EVENT_COLORS[item.name],
                }}
              />
              <span style={{ fontSize: '14px', color: '#A3A3A3', fontWeight: 500 }}>
                {EVENT_LABELS[item.name]}
              </span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

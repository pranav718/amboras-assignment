'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyRevenue } from '@/lib/types';


interface RevenueChartProps {
  data: DailyRevenue[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-green)' }}>
        ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="dashboard-card animate-in" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>Revenue Trend</h3>
        <div className="skeleton" style={{ height: '280px' }} />
      </div>
    );
  }

  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="dashboard-card animate-in animate-delay-2" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>Revenue Trend</h3>

      {formattedData.length === 0 ? (
        <div
          style={{
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6F6F6F',
            fontSize: '14px',
          }}
        >
          No revenue data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={formattedData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: '#A3A3A3', fontSize: 11, fontFamily: 'var(--font-inter)' }}
              axisLine={{ stroke: '#333333' }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fill: '#A3A3A3', fontSize: 11, fontFamily: 'var(--font-inter)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#111111' }} />
            <Bar
              dataKey="revenue"
              fill="#FFFFFF"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

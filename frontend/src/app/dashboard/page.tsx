'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import EventTypeBreakdown from '@/components/dashboard/EventTypeBreakdown';
import TopProducts from '@/components/dashboard/TopProducts';
import RecentActivity from '@/components/dashboard/RecentActivity';
import {
  useOverview,
  useTopProducts,
  useRecentActivity,
  useDailyRevenue,
} from '@/hooks/useAnalytics';


export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState('month');
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  const { data: overview, isLoading: overviewLoading } = useOverview(period);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(period);
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: dailyRevenue, isLoading: revenueLoading } = useDailyRevenue(period);

  if (!isAuthed) return null;

  
  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header period={period} onPeriodChange={setPeriod} />

      <div className="dashboard-grid">
        <div className="metrics-row">
          <MetricCard
            title="Total Revenue"
            value={overviewLoading ? '...' : formatCurrency(overview?.revenue.total || 0)}
            subtitle={overview ? `Today: ${formatCurrency(overview.revenue.today)}` : undefined}
            delay={1}
          />
          <MetricCard
            title="Total Events"
            value={overviewLoading ? '...' : (overview?.events.total || 0).toLocaleString()}
            subtitle={`${overview?.events.page_views.toLocaleString() || 0} page views`}
            delay={2}
          />
          <MetricCard
            title="Conversion Rate"
            value={overviewLoading ? '...' : `${overview?.conversion_rate || 0}%`}
            subtitle="Purchases / Page Views"
            delay={3}
          />
          <MetricCard
            title="Total Purchases"
            value={overviewLoading ? '...' : (overview?.events.purchases || 0).toLocaleString()}
            subtitle={overview ? `${overview.events.checkout_started} checkouts` : undefined}
            delay={4}
          />
        </div>

        <div className="charts-row">
          <RevenueChart
            data={dailyRevenue || []}
            loading={revenueLoading}
          />
          <EventTypeBreakdown
            data={overview}
            loading={overviewLoading}
          />
        </div>

        <div className="bottom-row">
          <TopProducts
            data={topProducts || []}
            loading={productsLoading}
          />
          <RecentActivity
            data={recentActivity || []}
            loading={activityLoading}
          />
        </div>
      </div>
    </div>
  );
}

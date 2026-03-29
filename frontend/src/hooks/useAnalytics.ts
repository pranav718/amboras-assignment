'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  OverviewResponse,
  TopProduct,
  RecentEvent,
  DailyRevenue,
} from '@/lib/types';



export function useOverview(period: string = 'today') {
  return useQuery<OverviewResponse>({
    queryKey: ['analytics', 'overview', period],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/overview?period=${period}`);
      return data;
    },
    refetchInterval: 30000, 
    staleTime: 15000, 
  });
}

export function useTopProducts(period: string = 'month') {
  return useQuery<TopProduct[]>({
    queryKey: ['analytics', 'top-products', period],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/top-products?period=${period}`);
      return data;
    },
    refetchInterval: 60000, 
    staleTime: 30000,
  });
}

export function useRecentActivity() {
  return useQuery<RecentEvent[]>({
    queryKey: ['analytics', 'recent-activity'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/recent-activity');
      return data;
    },
    refetchInterval: 10000, 
    staleTime: 5000,
  });
}

export function useDailyRevenue(period: string = 'month') {
  return useQuery<DailyRevenue[]>({
    queryKey: ['analytics', 'daily-revenue', period],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/daily-revenue?period=${period}`);
      return data;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

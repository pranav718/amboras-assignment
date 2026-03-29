import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Event } from '../entities/event.entity';
import { DailyMetric } from '../entities/daily-metric.entity';
import { ProductMetric } from '../entities/product-metric.entity';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(DailyMetric)
    private readonly dailyMetricRepo: Repository<DailyMetric>,
    @InjectRepository(ProductMetric)
    private readonly productMetricRepo: Repository<ProductMetric>,
    private readonly dataSource: DataSource,
  ) {}

  private getStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      case 'today':
      default:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
  }

  async getOverview(storeId: string, period: string) {
    const startDate = this.getStartDate(period);
    const startDateStr = startDate.toISOString().split('T')[0];

    const result = await this.dataSource.query(
      `SELECT 
        COALESCE(SUM(total_revenue), 0)::numeric as total_revenue,
        COALESCE(SUM(page_views), 0)::int as page_views,
        COALESCE(SUM(add_to_cart), 0)::int as add_to_cart,
        COALESCE(SUM(remove_from_cart), 0)::int as remove_from_cart,
        COALESCE(SUM(checkout_started), 0)::int as checkout_started,
        COALESCE(SUM(purchases), 0)::int as purchases
      FROM daily_metrics
      WHERE store_id = $1 AND date >= $2`,
      [storeId, startDateStr],
    );

    const metrics = result[0];
    const totalRevenue = parseFloat(metrics.total_revenue) || 0;
    const pageViews = parseInt(metrics.page_views) || 0;
    const purchases = parseInt(metrics.purchases) || 0;

    const conversionRate = pageViews > 0 ? (purchases / pageViews) * 100 : 0;

    const revenueByPeriod = await this.getRevenueByPeriod(storeId);

    return {
      period,
      revenue: {
        total: totalRevenue,
        today: revenueByPeriod.today,
        week: revenueByPeriod.week,
        month: revenueByPeriod.month,
      },
      events: {
        page_views: pageViews,
        add_to_cart: parseInt(metrics.add_to_cart) || 0,
        remove_from_cart: parseInt(metrics.remove_from_cart) || 0,
        checkout_started: parseInt(metrics.checkout_started) || 0,
        purchases,
        total:
          pageViews +
          (parseInt(metrics.add_to_cart) || 0) +
          (parseInt(metrics.remove_from_cart) || 0) +
          (parseInt(metrics.checkout_started) || 0) +
          purchases,
      },
      conversion_rate: Math.round(conversionRate * 100) / 100,
    };
  }

  private async getRevenueByPeriod(storeId: string) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7,
    )
      .toISOString()
      .split('T')[0];
    const monthAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 30,
    )
      .toISOString()
      .split('T')[0];

    const result = await this.dataSource.query(
      `SELECT
        COALESCE(SUM(CASE WHEN date >= $2 THEN total_revenue ELSE 0 END), 0)::numeric as today,
        COALESCE(SUM(CASE WHEN date >= $3 THEN total_revenue ELSE 0 END), 0)::numeric as week,
        COALESCE(SUM(CASE WHEN date >= $4 THEN total_revenue ELSE 0 END), 0)::numeric as month
      FROM daily_metrics
      WHERE store_id = $1 AND date >= $4`,
      [storeId, todayStr, weekAgo, monthAgo],
    );

    return {
      today: parseFloat(result[0].today) || 0,
      week: parseFloat(result[0].week) || 0,
      month: parseFloat(result[0].month) || 0,
    };
  }

  async getTopProducts(storeId: string, period: string) {
    const startDate = this.getStartDate(period);
    const startDateStr = startDate.toISOString().split('T')[0];

    const products = await this.dataSource.query(
      `SELECT
        product_id,
        SUM(revenue)::numeric as total_revenue,
        SUM(quantity_sold)::int as total_quantity
      FROM product_metrics
      WHERE store_id = $1 AND date >= $2
      GROUP BY product_id
      ORDER BY total_revenue DESC
      LIMIT 10`,
      [storeId, startDateStr],
    );

    return products.map((p: any) => ({
      product_id: p.product_id,
      revenue: parseFloat(p.total_revenue) || 0,
      quantity_sold: parseInt(p.total_quantity) || 0,
    }));
  }

  async getRecentActivity(storeId: string) {
    const events = await this.eventRepo.find({
      where: { store_id: storeId },
      order: { timestamp: 'DESC' },
      take: 20,
    });

    return events.map((e) => ({
      event_id: e.event_id,
      event_type: e.event_type,
      timestamp: e.timestamp,
      data: e.data,
    }));
  }

  async getDailyRevenue(storeId: string, period: string) {
    const startDate = this.getStartDate(period);
    const startDateStr = startDate.toISOString().split('T')[0];

    const rows = await this.dataSource.query(
      `SELECT
        date,
        total_revenue::numeric as revenue,
        page_views,
        purchases
      FROM daily_metrics
      WHERE store_id = $1 AND date >= $2
      ORDER BY date ASC`,
      [storeId, startDateStr],
    );

    return rows.map((r: any) => ({
      date: r.date,
      revenue: parseFloat(r.revenue) || 0,
      page_views: parseInt(r.page_views) || 0,
      purchases: parseInt(r.purchases) || 0,
    }));
  }
}

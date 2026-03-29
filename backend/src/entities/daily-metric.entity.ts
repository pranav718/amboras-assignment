import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

@Entity('daily_metrics')
@Unique(['store_id', 'date'])
@Index('idx_daily_metrics_store_date', ['store_id', 'date'])
export class DailyMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  store_id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_revenue: number;

  @Column({ type: 'int', default: 0 })
  page_views: number;

  @Column({ type: 'int', default: 0 })
  add_to_cart: number;

  @Column({ type: 'int', default: 0 })
  remove_from_cart: number;

  @Column({ type: 'int', default: 0 })
  checkout_started: number;

  @Column({ type: 'int', default: 0 })
  purchases: number;
}

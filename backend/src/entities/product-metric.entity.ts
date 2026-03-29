import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

@Entity('product_metrics')
@Unique(['store_id', 'product_id', 'date'])
@Index('idx_product_metrics_store_date', ['store_id', 'date'])
export class ProductMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  store_id: string;

  @Column({ type: 'varchar', length: 100 })
  product_id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'int', default: 0 })
  quantity_sold: number;
}

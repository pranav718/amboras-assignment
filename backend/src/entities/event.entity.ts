import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('events')
@Index('idx_events_store_timestamp', ['store_id', 'timestamp'])
@Index('idx_events_store_type', ['store_id', 'event_type'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  event_id: string;

  @Column({ type: 'varchar', length: 100 })
  store_id: string;

  @Column({ type: 'varchar', length: 50 })
  event_type: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'jsonb', default: {} })
  data: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

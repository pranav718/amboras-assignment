import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  store_id: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  store_name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

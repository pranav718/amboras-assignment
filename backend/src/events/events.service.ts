import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Event } from '../entities/event.entity';

import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    private readonly dataSource: DataSource,
  ) {}

  async ingestEvent(dto: CreateEventDto): Promise<Event> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = queryRunner.manager.create(Event, {
        event_id: dto.event_id,
        store_id: dto.store_id,
        event_type: dto.event_type,
        timestamp: new Date(dto.timestamp),
        data: dto.data || {},
      });
      await queryRunner.manager.save(event);

      const eventDate = new Date(dto.timestamp).toISOString().split('T')[0];

      await this.upsertDailyMetrics(queryRunner, dto, eventDate);

      if (dto.event_type === 'purchase' && dto.data?.product_id) {
        await this.upsertProductMetrics(queryRunner, dto, eventDate);
      }

      await queryRunner.commitTransaction();
      return event;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if ((error as { code?: string }).code === '23505') {
        this.logger.warn(`Duplicate event: ${dto.event_id}`);
        return this.eventRepo.findOne({
          where: { event_id: dto.event_id },
        }) as Promise<Event>;
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async ingestBatch(events: CreateEventDto[]): Promise<{ ingested: number }> {
    let ingested = 0;
    for (const event of events) {
      try {
        await this.ingestEvent(event);
        ingested++;
      } catch (error) {
        this.logger.warn(
          `Failed to ingest event ${event.event_id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return { ingested };
  }

  private async upsertDailyMetrics(
    queryRunner: QueryRunner,
    dto: CreateEventDto,
    eventDate: string,
  ) {
    const columnMap: Record<string, string> = {
      page_view: 'page_views',
      add_to_cart: 'add_to_cart',
      remove_from_cart: 'remove_from_cart',
      checkout_started: 'checkout_started',
      purchase: 'purchases',
    };

    const column = columnMap[dto.event_type];
    if (!column) return;

    const amount =
      dto.event_type === 'purchase' ? (dto.data?.amount as number) || 0 : 0;

    await queryRunner.query(
      `INSERT INTO daily_metrics (store_id, date, ${column}, total_revenue)
       VALUES ($1, $2, 1, $3)
       ON CONFLICT (store_id, date)
       DO UPDATE SET
         ${column} = daily_metrics.${column} + 1,
         total_revenue = daily_metrics.total_revenue + $3`,
      [dto.store_id, eventDate, amount],
    );
  }

  private async upsertProductMetrics(
    queryRunner: QueryRunner,
    dto: CreateEventDto,
    eventDate: string,
  ) {
    const amount = (dto.data?.amount as number) || 0;
    const productId = dto.data?.product_id as string | undefined;

    await queryRunner.query(
      `INSERT INTO product_metrics (store_id, product_id, date, revenue, quantity_sold)
       VALUES ($1, $2, $3, $4, 1)
       ON CONFLICT (store_id, product_id, date)
       DO UPDATE SET
         revenue = product_metrics.revenue + $4,
         quantity_sold = product_metrics.quantity_sold + 1`,
      [dto.store_id, productId, eventDate, amount],
    );
  }
}

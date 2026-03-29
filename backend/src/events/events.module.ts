import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from '../entities/event.entity';
import { DailyMetric } from '../entities/daily-metric.entity';
import { ProductMetric } from '../entities/product-metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, DailyMetric, ProductMetric])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

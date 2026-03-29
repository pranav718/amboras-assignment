import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Event } from '../entities/event.entity';
import { DailyMetric } from '../entities/daily-metric.entity';
import { ProductMetric } from '../entities/product-metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, DailyMetric, ProductMetric])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

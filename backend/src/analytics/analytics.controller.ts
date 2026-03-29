import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StoreId } from '../common/decorators/store-id.decorator';
import { AnalyticsService } from './analytics.service';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview(@StoreId() storeId: string, @Query() query: DateRangeDto) {
    return this.analyticsService.getOverview(storeId, query.period || 'today');
  }

  @Get('top-products')
  getTopProducts(@StoreId() storeId: string, @Query() query: DateRangeDto) {
    return this.analyticsService.getTopProducts(
      storeId,
      query.period || 'today',
    );
  }

  @Get('recent-activity')
  getRecentActivity(@StoreId() storeId: string) {
    return this.analyticsService.getRecentActivity(storeId);
  }

  @Get('daily-revenue')
  getDailyRevenue(@StoreId() storeId: string, @Query() query: DateRangeDto) {
    return this.analyticsService.getDailyRevenue(
      storeId,
      query.period || 'today',
    );
  }
}

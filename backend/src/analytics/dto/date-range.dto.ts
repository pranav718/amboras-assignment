import { IsOptional, IsIn } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsIn(['today', 'week', 'month'], {
    message: 'period must be one of: today, week, month',
  })
  period?: 'today' | 'week' | 'month' = 'today';
}

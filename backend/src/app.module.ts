import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://amboras:amboras_secret@localhost:5432/amboras_analytics',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    }),

    AuthModule,
    AnalyticsModule,
    EventsModule,
  ],
})
export class AppModule {}

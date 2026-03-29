import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async ingestEvent(@Body() dto: CreateEventDto) {
    const event = await this.eventsService.ingestEvent(dto);
    return { success: true, event_id: event.event_id };
  }

  @Post('batch')
  async ingestBatch(@Body() events: CreateEventDto[]) {
    const result = await this.eventsService.ingestBatch(events);
    return { success: true, ...result };
  }
}

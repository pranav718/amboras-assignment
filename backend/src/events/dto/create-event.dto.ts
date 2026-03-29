import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsObject,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsString()
  @IsNotEmpty()
  store_id: string;

  @IsString()
  @IsIn(
    [
      'page_view',
      'add_to_cart',
      'remove_from_cart',
      'checkout_started',
      'purchase',
    ],
    {
      message:
        'event_type must be one of: page_view, add_to_cart, remove_from_cart, checkout_started, purchase',
    },
  )
  event_type: string;

  @IsDateString(
    {},
    { message: 'timestamp must be a valid ISO 8601 date string' },
  )
  timestamp: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

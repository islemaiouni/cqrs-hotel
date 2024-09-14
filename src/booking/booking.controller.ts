// src/booking/booking.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { IsString, IsDateString } from 'class-validator';
import * as Decider from './booking.decider';
import { EventStoreDBClient } from '@eventstore/db-client';
import { createCommandHandler } from '../utils/command-handler';

class BookRoomDto {
  @IsString()
  roomId: string;

  @IsString()
  customerId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

@Controller('booking')
export class BookingController {
  private readonly handle: (command: Decider.Command) => Promise<any>;

  constructor(private readonly client: EventStoreDBClient) {
    this.handle = createCommandHandler(client, cmd => `Booking-${cmd.data.roomId}`, Decider);
  }

  @Post('book')
  async bookRoom(@Body() { roomId, customerId, startDate, endDate }: BookRoomDto) {
    return this.handle({ type: 'BookRoom', data: { roomId, customerId, startDate, endDate } });
  }
}

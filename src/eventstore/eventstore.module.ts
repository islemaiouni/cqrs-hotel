// src/eventstore/eventstore.module.ts
import { Module, Global } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';

// Create a connection to EventStoreDB using gRPC
const EventStoreProvider = {
  provide: 'EVENT_STORE',
  useFactory: () => EventStoreDBClient.connectionString`esdb://admin:changeit@localhost:2113?tls=false`,
};

@Global()
@Module({
  providers: [EventStoreProvider],
  exports: [EventStoreProvider],
})
export class EventStoreModule {}

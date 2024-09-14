// src/utils/command-handler.ts
import { EventStoreDBClient } from '@eventstore/db-client';

type Decider<S, E, C> = {
  initialState: S;
  evolve: (state: S, event: E) => S;
  decide: (state: S, command: C) => E[];
};

export const createCommandHandler = <S, E extends { type: string; data: any }, C>(
  client: EventStoreDBClient,
  getStreamName: (command: C) => string,
  decider: Decider<S, E, C>,
) => async (command: C, context?: any) => {
  const streamName = getStreamName(command);
  let state = decider.initialState;

  // Read events from the event store to reconstruct the current state
  const events = await client.readStream(streamName);
  for await (const event of events) {
    state = decider.evolve(state, event as E);
  }

  // Decide on new events based on the current state and command
  const newEvents = decider.decide(state, command).map(event => ({
    type: event.type,
    data: event.data,
    metadata: context,
  }));

  // Append new events to the event store
  await client.appendToStream(streamName, newEvents);
  return { success: true };
};

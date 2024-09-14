// src/booking/booking.decider.ts
type DomainEvent<Type extends string, Data extends Record<string, any>> = {
    type: Type;
    data: Data;
  };
  
  // Event and command types for booking a room
  export type RoomBooked = { roomId: string; customerId: string; startDate: string; endDate: string };
  export type BookRoom = { roomId: string; customerId: string; startDate: string; endDate: string };
  export type Event = DomainEvent<'RoomBooked', RoomBooked>;
  export type Command = DomainEvent<'BookRoom', BookRoom>;
  
  // Define the possible states of a booking
  export type State = { type: 'initial' } | { type: 'booked'; roomId: string; customerId: string; startDate: string; endDate: string };
  export const initialState: State = { type: 'initial' };
  
  // Evolve the state based on the event
  export const evolve = (state: State, event: Event): State => {
    switch (event.type) {
      case 'RoomBooked':
        return { type: 'booked', ...event.data };
      default:
        return state;
    }
  };
  
  // Decide which events to emit based on the command
  export const decide = (state: State, command: Command) => {
    switch (command.type) {
      case 'BookRoom':
        if (state.type === 'initial') return [{ type: 'RoomBooked', data: command.data }];
        throw new Error('Room already booked');
      default:
        return [];
    }
  };
  
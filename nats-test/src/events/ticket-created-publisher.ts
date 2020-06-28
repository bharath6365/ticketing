import { TicketCreatedEvent } from './ticket-created-event';
import {Message, Stan} from 'node-nats-streaming';
import Publisher from './base-publisher';
import {Subjects} from './subjects';
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // Final equivalent in Java.
  readonly subject = Subjects.TicketCreated; 
}
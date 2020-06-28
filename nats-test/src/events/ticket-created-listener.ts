import { TicketCreatedEvent, Subjects, Listener } from '@bhticketsell/common';
import {Message, Stan} from 'node-nats-streaming';
export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // Final equivalent in Java.
  readonly subject = Subjects.TicketCreated; 
  queueGroupName = 'payments-service';
  // Type argument is ticket created event.data
  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data', data);

    msg.ack();
  }
  
}
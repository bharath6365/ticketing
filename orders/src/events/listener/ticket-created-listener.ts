import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent} from '@bhticketsell/common';

import {Ticket} from '../../models/tickets';
import QUEUE_GROUP_NAME from '../queue-group';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;  
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
     
    const {title, price, id, userId} = data;
    // Save the event to Mongo.
    const ticket = Ticket.build({id,title, price, userId});
    await ticket.save();

    // Acknowledge the Message
    msg.ack();
  }


}
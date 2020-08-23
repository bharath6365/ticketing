import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketUpdatedEvent} from '@bhticketsell/common';
import {Ticket} from '../../models/tickets';
import QUEUE_GROUP_NAME from '../queue-group';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;  
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    console.log('Ticket Updated Event received');
    
    const {title, price, id, version} = data;

    // Get the ticket. Version should be version -1.
    const ticket = await Ticket.findByEvent({id, version});


    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Update the ticket and save on the DB.
    ticket.set({title, price});
    await ticket.save();

    // Acknowledge the Message
    msg.ack();
  }


}
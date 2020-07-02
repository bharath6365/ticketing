import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent, OrderCreatedEvent} from '@bhticketsell/common';

import {Ticket} from '../../models/tickets';
import QUEUE_GROUP_NAME from '../queue-group-name';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;  
  queueGroupName= QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    // Find the ticket that the order is receiving.
    const ticket = await Ticket.findById(data.ticket.id);
    // If ticket is not found throw error.
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    // Mark the ticket as being reserved.
    ticket.set({orderId: data.id});

    // save the ticket
    await ticket.save();
    
    // Publish the ticket updated event
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })
    // Acknowledge the msg.
    msg.ack();
  }


}
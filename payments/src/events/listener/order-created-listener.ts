import {Message} from 'node-nats-streaming';
import {Subjects, Listener, TicketCreatedEvent, OrderCreatedEvent} from '@bhticketsell/common';

import QUEUE_GROUP_NAME from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;  
  queueGroupName= QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    console.log('Payments order created event received');

    // Create a Order
    const order = Order.build({
      id: data.id,
      status: data.status,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price
    })
    // Save.
  
    await order.save();
    // Acknowledge the msg.
    msg.ack();
  }


}
import { OrderCancelledPublisher } from './../publisher/order-cancelled-publisher';
import {Message} from 'node-nats-streaming';
import {Subjects, Listener, ExpirationCompleteEvent, NotFoundError, OrderStatus} from '@bhticketsell/common';

import {Order} from '../../models/orders';
import QUEUE_GROUP_NAME from '../queue-group';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;  
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
    console.log('Expiration Complete listener received data');
   
    // Find the order. Get the ticket details too.
    const order = await Order.findById(data.orderId).populate('ticket');
    
    if (!order) throw new Error('Order not found');

    // If it's a completed order do not update the status of the ticket.
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }


    order.set({
      status: OrderStatus.Canceled
    })
    await order.save();

    // Publish an event to tickets/payments that order was cancelled.
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    })

    // Acknowledge the Message
    msg.ack();
  }


}
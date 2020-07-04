import {Message} from 'node-nats-streaming';
import {Subjects, Listener, OrderCancelledEvent, OrderStatus} from '@bhticketsell/common';

import QUEUE_GROUP_NAME from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;  
  queueGroupName= QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {

    // Find the order.
    const order = await Order.findOne({
      id: data.id,
      version: data.version - 1
    });

    if (!order) {
      throw new Error('Order not found')
    };

    order.set({
      status: OrderStatus.Canceled
    })
  
    await order.save();
    // Acknowledge the msg.
    msg.ack();
  }

}
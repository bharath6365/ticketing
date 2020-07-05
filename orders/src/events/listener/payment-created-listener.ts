import {Message} from 'node-nats-streaming';
import {Subjects, Listener, PaymentCreatedEvent, OrderStatus} from '@bhticketsell/common';

import {Order} from '../../models/orders';
import QUEUE_GROUP_NAME from '../queue-group';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
readonly subject = Subjects.PaymentCreated;  
queueGroupName = QUEUE_GROUP_NAME;
async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
    
  const order = await Order.findById(data.orderId);

  if (!order) {
    throw new Error('Order not found')
  };

  order.set({status: OrderStatus.Complete});

  await order.save();

  // Acknowledge the Message
  msg.ack();
}


}
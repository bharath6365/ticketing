import { natsWrapper } from '../nats-wrapper';
import express, {Request, Response} from 'express';
import { requireAuth, NotFoundError, OrderStatus } from '@bhticketsell/common';
import { Order } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';

const router = express.Router();


router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  // Get the order.
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    orderId: req.params.orderId
  }).populate('ticket')

  if (!order) throw new NotFoundError();

  order.status = OrderStatus.Canceled;

  await order.save();

  // Publish Order Cancelled Event
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    },
    version: order.version
  })

  res.send(order);

})

export {router as deleteOrderRouter};
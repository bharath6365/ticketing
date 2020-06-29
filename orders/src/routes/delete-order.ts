import express, {Request, Response} from 'express';
import { requireAuth, NotFoundError, OrderStatus } from '@bhticketsell/common';
import { Order } from '../models/orders';

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

  res.send(order);

})

export {router as deleteOrderRouter};
import express, {Request, Response} from 'express';
import { requireAuth, NotFoundError } from '@bhticketsell/common';
import { Order } from '../models/orders';

const router = express.Router();


router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  // Get the order.
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    orderId: req.params.orderId
  }).populate('ticket')

  if (!order) throw new NotFoundError();

  res.send(order);

})

export {router as showOrderRouter};
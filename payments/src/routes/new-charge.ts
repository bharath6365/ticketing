import express, {Request, Response } from 'express';
import {body} from 'express-validator';

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@bhticketsell/common';

import {natsWrapper} from '../nats-wrapper';
import {Order} from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';

const router = express.Router();

router.post('/api/payments', requireAuth, [
  body('token')
  .not()
  .isEmpty(),
  body('orderId')
  .not()
  .isEmpty()
], validateRequest, async (req: Request, res: Response) => {
  // Get the token and orderId from the body
  const {token, orderId} = req.body;

  // Get the order from the database.
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  // Check for user
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // Check for the status of the order.
  if (order.status === OrderStatus.Canceled) {
    throw new BadRequestError("Cannot pay for a cancelled order");
  }

  // Create a stripe charge.
  const charge = await stripe.charges.create({
    currency: 'inr',
    amount: order.price * 10,
    source: token
  })
  
  // Create a payment.
  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  })

  await payment.save();

  // Publish an event that the payment was made.
  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  })

  // Ok now you can pay for this thing.
  res.status(201).send({id: payment.id});
})

export {router as createChargeRouter};
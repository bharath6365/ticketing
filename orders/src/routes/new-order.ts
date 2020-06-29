import { ORDER_EXPIRATION } from './../constants/index';
import express, {Request, Response} from 'express';
import {requireAuth, validateRequest, NotFoundError, OrderStatus,  BadRequestError} from '@bhticketsell/common';
import {body} from 'express-validator';

import {Ticket} from '../models/tickets';
import {Order} from '../models/orders';

const router = express.Router();


router.post('/api/orders',requireAuth, [
  body('ticketId')
  .not()
  .isEmpty()
  .withMessage('Ticket ID must be provided')
], validateRequest, async (req: Request, res: Response) => {
  const {ticketId} = req.body;
  // Find the ticket user is trying to order in the database.
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

    const isReserved = await ticket.isReserved()

    // If existing order is found it's used by someone else.
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

  // Calculate an expiration time for this order.
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + ORDER_EXPIRATION);

  // Build the order and save it to the database.
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })
  await order.save();

  // Passing events for other services that order was created.


  res.status(201).send(order);
})

export {router as createOrderRouter};
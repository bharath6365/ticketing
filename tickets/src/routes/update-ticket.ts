
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {natsWrapper} from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

// import { User } from '../models/User';
import { BadRequestError, NotAuthorizedError, validateRequest, requireAuth, NotFoundError } from '@bhticketsell/common'; 
import { Ticket } from '../models/tickets';


const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Email must be valid'),
  body('price')
    .isFloat({gt: 0})
    .withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {

  const {title, price} = req.body;

  // Get the ticket  from the database.
  const ticket = await Ticket.findById(req.params.id);
  
  if (!ticket) {
    throw new NotFoundError();
  }

  // Check if user is the owner of the ticket.
  // ! tells typescript not to worry.
  if (req.currentUser!.id !== ticket.userId) {
    throw new NotAuthorizedError();
  }
  
  // Update the ticket.
  ticket.set({
    title,
    price
  })

  await ticket.save();
  
  // Publishing event to NATS.
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  })

  res.send(ticket);

  
})

export { router as updateTicketRouter };
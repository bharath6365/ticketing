
import express, {Request, Response} from 'express';
import {body} from 'express-validator';

// import { User } from '../models/User';
import { BadRequestError, TokenManager, validateRequest, requireAuth } from '@bhticketsell/common'; 
import { Ticket } from '../models/tickets';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post('/api/tickets', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is mandatory'),
  body('description')
    .not()
    .isEmpty()
    .withMessage('Description is mandatory'),
  body('price')
    .isFloat({gt: 0})
    .withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {
  
  const {title, price, description} = req.body;

  const ticket = Ticket.build({
    title, 
    price,
    userId: req.currentUser!.id,
    owner: req.currentUser!.email,
    description
  });

  await ticket.save();
  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  })

  res.status(201).send(ticket);

  
})

export { router as createTicketRouter };
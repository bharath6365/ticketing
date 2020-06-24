
import express, {Request, Response} from 'express';
import {body} from 'express-validator';

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
  if (req.currentUser!.id !== ticket.id) {
    throw new NotAuthorizedError();
  }

  res.send(ticket);

  
})

export { router as updateTicketRouter };
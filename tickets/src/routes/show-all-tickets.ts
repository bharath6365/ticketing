
import express, {Request, Response} from 'express';


import { Ticket } from '../models/tickets';


const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  
  // orderId: undefined means that these are tickets that are not sold yet.
  const tickets = await Ticket.find({
    orderId: undefined
  });

  res.send(tickets);

})

export { router as showAllTicketsRouter };
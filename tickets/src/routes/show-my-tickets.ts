
import express, {Request, Response} from 'express';
import { requireAuth } from '@bhticketsell/common'; 


import { Ticket } from '../models/tickets';


const router = express.Router();

router.get('/api/tickets-currentuser', requireAuth,  async (req: Request, res: Response) => {
  
  // orderId: undefined means that these are tickets that are not sold yet.

  const tickets = await Ticket.find({
    orderId: undefined,
    owner: req.currentUser!.email,
  });

  console.log('Tickets is', tickets);


  res.send(tickets);

})

export { router as showMyTicketsRouter };
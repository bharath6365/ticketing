
import express, {Request, Response} from 'express';
import { requireAuth } from '@bhticketsell/common'; 


import { Ticket } from '../models/tickets';


const router = express.Router();

router.get('/api/tickets-currentuser', requireAuth,  async (req: Request, res: Response) => {
  
  // orderId: undefined means that these are tickets that are not sold yet.

  const tickets = await Ticket.find({
    owner: req.currentUser!.email,
  });



  res.send(tickets);

})

export { router as showMyTicketsRouter };
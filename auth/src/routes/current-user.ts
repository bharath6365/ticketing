import express from 'express';
import { User } from '../models/User';
import TokenManager from '../services/token-manager';
import currentUser from '../middlewares/current-user';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res) => {

  res.status(200).send({currentUser: req.currentUser || null});
})



export {router as currentUserRouter};
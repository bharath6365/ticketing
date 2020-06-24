import express from 'express';
import { User } from '../models/User';
import {currentUser} from '@bhticketsell/common';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res) => {

  res.status(200).send({currentUser: req.currentUser || null});
})



export {router as currentUserRouter};
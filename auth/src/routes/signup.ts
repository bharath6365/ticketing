
import express, {Request, Response} from 'express';
import {body} from 'express-validator';

import { User } from '../models/User';
import { BadRequestError } from '../errors/bad-request-error'; 
import validateRequest from '../middlewares/validate-request';
import TokenManager from '../services/token-manager';


const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('Password must be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response) => {

  const {email, password} = req.body;
  
  const existingUser = await User.findOne({email});
  
  if (existingUser) {
    throw new BadRequestError('User Email already exists');
  }
  
  const user = User.build({email, password});

  await user.save();

  // Build the token.
  const userJWT = await TokenManager.generateToken(user);
  
  req.session = {
    jwt: userJWT
  }

  res.status(201).send(user);

})

export { router as signupRouter };
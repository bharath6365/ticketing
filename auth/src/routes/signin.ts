import { BadRequestError } from './../errors/bad-request-error';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import validateRequest from '../middlewares/validate-request';
import { User } from '../models/User';
import Password from '../services/password';
import TokenManager from '../services/token-manager';

const router = express.Router();

router.get(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ], validateRequest,
  async (req: Request, res: Response) => {
    const {email, password} = req.body
    

    const userExists = await User.findOne({email});
    
    // Check if email exists.
    if (!userExists) {
      throw new BadRequestError('Invalid Credentials');
    }
    
    // Compare the passwords.
    const passwordInDB = userExists.password;
    const passwordsMatch = await Password.compare(passwordInDB, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate a token
    const userJWT = await TokenManager.generateToken(userExists);

    req.session = {
      jwt: userJWT
    }

    res.status(200).send(userExists);
  }
);

export { router as signinRouter };

import {Request, Response, NextFunction} from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// We Assume that currentUser is set.
export default async function requireAuth(req: Request, res: Response,next: NextFunction) {
  // See if the token exists.
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
}
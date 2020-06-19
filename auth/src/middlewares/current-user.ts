import {Request, Response, NextFunction} from 'express';
import TokenManager from '../services/token-manager';

// req.currentUser = payload giving us headache.
interface UserPayload {
  id: string;
  email: string;
}

// Make a modification to an existing global interface
declare global {
  namespace Express {
    interface Request {
      // Attaches the currentUser to Request.
      currentUser?: UserPayload;
    }
  }
}
export default async function currentUser(req: Request, res: Response,next: NextFunction) {
  // See if the token exists.
  const token = req.session?.jwt;


  if (!token) {
    return next();
  }

  // Let's get the payload on the token.
  try {
    const payload = await TokenManager.getPayloadIfVerified(token) as UserPayload;
    req.currentUser = payload;
  } catch (e) {
    console.log(e);
  }
  next();
}
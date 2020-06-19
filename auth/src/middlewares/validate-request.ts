import {Request, Response, NextFunction} from 'express';
import { RequestValidationError } from '../errors/request-validation-errors';
import { validationResult } from 'express-validator';

export default function validateRequest(req: Request, res: Response,next: NextFunction) {
  const errors = validationResult(req);

    // Pass the errors as JSON data.
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    } else {
      next();
    }
}
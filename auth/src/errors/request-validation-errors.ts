// Descibes the validation error.
import {ValidationError} from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  /*
     private here technically means we are doing this.errors = errors.
  */
  constructor(public errors: ValidationError[]) {
    super('Invalid Request Body');

    // Only because we are extending built-in class of Javascript
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(error => {
      return {
        message: error.msg,
        field: error.param
      }
    })
  }
}
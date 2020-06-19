import { CustomError } from "./custom-error";

// Descibes the validation error.

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
  super('Not Authorized');

   // Only because we are extending built-in class of Javascript
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {

    return [
      { message: 'Not Authorized' }
    ];
  }
}
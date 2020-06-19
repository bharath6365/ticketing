import { CustomError } from "./custom-error";

// Descibes the validation error.

export class NotFoundError extends CustomError {
  statusCode = 404;
  private reason = "Route not found"
  constructor() {
    super('Route not found');

    // Only because we are extending built-in class of Javascript
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {

    return [
      {message: this.reason}
    ];
  }
}
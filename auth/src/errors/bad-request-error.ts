import { CustomError } from "./custom-error";

// Descibes the validation error.

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);

    // Only because we are extending built-in class of Javascript
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {

    return [
      { message: this.message }
    ];
  }
}
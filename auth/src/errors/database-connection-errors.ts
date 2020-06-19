import { CustomError } from "./custom-error";

// Descibes the validation error.

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  public reason = "Error connecting to database"
  constructor() {
    super('Database connection error');

    // Only because we are extending built-in class of Javascript
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {

    return [
      {message: this.reason}
    ];
  }
}
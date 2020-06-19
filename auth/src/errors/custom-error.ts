export abstract class CustomError extends Error {
  abstract statusCode: number;

  abstract serializeErrors(): {
    message: string,
    field?: string
  }[];

  constructor(message: string) {
    // Super for server logs.
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
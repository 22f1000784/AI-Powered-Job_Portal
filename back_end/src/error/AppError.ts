export class AppError extends Error {
  statusCode: number;

  constructor(error: { message: string; statusCode: number }) {
    super(error.message);
    this.statusCode = error.statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
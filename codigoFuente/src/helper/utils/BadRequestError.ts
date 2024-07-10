import { HttpError } from "./HttpError";
import { StatusCodes } from 'http-status-codes';

export class BadRequestError<ContextType> extends HttpError<ContextType> {
  public readonly name = "BadRequestError";

  constructor(
    public readonly message: string = "Bad Request",
    public readonly context?: ContextType
  ) {
    super(StatusCodes.BAD_REQUEST, message, context);
  }
}
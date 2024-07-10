import { HttpError } from "./HttpError";
import { StatusCodes } from 'http-status-codes';

export class NotFoundError<ContextType> extends HttpError<ContextType> {
  public readonly name = "NotFoundError";

  constructor(
    public readonly message: string = "Not Found Error",
    public readonly context?: ContextType
  ) {
    super(StatusCodes.NOT_FOUND, message, context);
  }
}
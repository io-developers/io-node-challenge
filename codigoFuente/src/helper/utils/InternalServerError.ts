import { HttpError } from "./HttpError";
import { StatusCodes } from 'http-status-codes';

export class InternalServerError<ContextType> extends HttpError<ContextType> {
  public readonly name = "InternalServerError";

  constructor(
    public readonly message: string = "Internal Server error",
    public readonly context?: ContextType
  ) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message, context);
  }
}
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "../../helper/logs/Logger";
import { ProcessService } from "../aplication/ProcessService";
import {
  errorResponse,
  successResponse,
} from "../../helper/http/responseHandler";
import { StatusCodes } from "http-status-codes";

const processService = new ProcessService();

export const processPayment = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    logger.trace("Processing transaction");

    const payload: string | null= event.body;
    const result = processService.processPayment(payload);
    return successResponse(StatusCodes.OK, result);
  } catch (err) {
    return errorResponse(StatusCodes.BAD_REQUEST, "process incorrect");
  }
};

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "../../../helper/logs/Logger";
import {
  errorResponse,
  successResponse,
} from "../../../helper/http/responseHandler";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import dynamoDbClient from "../db/DynamoDbClient";
import { Transaction } from "../../domain/entitys/transaction.entity";
import { PaymentService } from "../../aplication/PaymentService";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";

const paymentRepository = new PaymentRepository(axios, logger);
const transactionRepository = new TransactionRepository(dynamoDbClient, logger);
const paymentService = new PaymentService(
  paymentRepository,
  transactionRepository,
  logger
);

export const startProcess = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    logger.trace("Processing transaction");

    const transactionBody = event.body || "{}";
    const transaction: Transaction = JSON.parse(transactionBody);
    logger.info(JSON.parse(transactionBody));

    const result = await paymentService.startProcess(transaction);
    return successResponse(StatusCodes.OK, result);
  } catch (err) {
    return errorResponse(
      StatusCodes.BAD_REQUEST,
      "process incorrect, bad request"
    );
  }
};

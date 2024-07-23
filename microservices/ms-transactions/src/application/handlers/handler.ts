import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TransactionService } from '../services/transaction.service';
import { DynamoDBTransactionRepository } from '../../infrastructure/repository/transaction.repository';
import { dynamoDbClient } from '../../infrastructure/database/dynamodb.client';
import { HttpStatusCode } from 'axios';
import { Logger } from '../../infrastructure/logging/Logger';


const logger = new Logger();
const transactionRepository = new DynamoDBTransactionRepository(dynamoDbClient, logger);
const transactionService = new TransactionService(transactionRepository, logger);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    const transactionId = event.queryStringParameters?.transaction_id;

    if (!transactionId) {
      console.log(`[Handler-Transaction]  Missing Transaction`);
      return {
        statusCode: HttpStatusCode.BadRequest,
        body: JSON.stringify({ message: `Missing transactionId` }),
      }
    }

    const rowTransaction = await transactionService.findById(transactionId);

    if (!rowTransaction || rowTransaction === null || rowTransaction === undefined) {
      console.log(`[Handler-Transaction] Transaction ${transactionId} not found.`);
      return {
        statusCode: HttpStatusCode.NotFound,
        body: JSON.stringify({
          "message": "Transaction not found",
          "transactionId": transactionId
        }),
      };
    }

    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify(rowTransaction),
    };

  } catch (error) {
    logger.error(`[Handler-Transaction][Event:${event}] - Error: ${error}`);
    return {
      statusCode: HttpStatusCode.InternalServerError,
      body: JSON.stringify({ message: error }),
    };
  }
};

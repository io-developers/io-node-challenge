import { Logger } from "../../infrastructure/logging/Logger";
import { PaymentService } from "../services/payment.service";
import { TransactionClient } from "../../infrastructure/requester/transactionClient";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PaymentDto } from "../dto/paymentDto";


const logger = new Logger();
const client = new TransactionClient(logger);
const paymentService = new PaymentService(client, logger);

export const handler = async (event: PaymentDto): Promise<APIGatewayProxyResult> => {

  logger.info(`[Execute-payment][handler] event ${JSON.stringify(event)} `);

  const userId = event.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required field: userId' })
    };
  }

  try {
    const payment = await paymentService.executePayment(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Payment executed successfully', transaction: payment })
    };
  } catch (error) {
    logger.error(`[Execute-payment][handler] user ${userId} throw error: ` + error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Payment execution failed', error: error })
    };
  }
};

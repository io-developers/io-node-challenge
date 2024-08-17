import { APIGatewayProxyHandler } from 'aws-lambda';
import { Payment } from '../domain/Payment';
import { PaymentService } from '../domain/PaymentService';
import { DynamoDBPaymentRepository } from './DynamoDBPaymentRepository';
import logger from '../../common/Logger';
import { ValidIdUserExistUseCase } from '../application/ValidIfUserExistUseCase';
import { DynamoDBUserRepository } from './DynamoDBUserRepository';
import { UserService } from '../domain/UserService';

const paymentRepository = new DynamoDBPaymentRepository();
const userRepository = new DynamoDBUserRepository();

const paymentService = new PaymentService(paymentRepository);
const userService = new UserService(userRepository);
const userExistUserCase = new ValidIdUserExistUseCase(userService);

export const createPayment: APIGatewayProxyHandler = async (event) => {
  try {
    const { userId, amount } = JSON.parse(event.body!);
    const userExist = await userExistUserCase.execute(userId);
    if (!userExist) {
      logger.error(`User not exists in resource ${userId}`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'User provide not exists in resource',
        }),
      };
    }
    const payment = new Payment(userId, amount);
    const transactionId = await paymentService.registerPayment(payment);
    logger.info('Payment register event', { transactionId });
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Payment registered successfully',
        transactionId: transactionId,
      }),
    };
  } catch (error) {
    logger.error('Error registering payment:', { error });
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Something was wrong', hola: error }),
    };
  }
};

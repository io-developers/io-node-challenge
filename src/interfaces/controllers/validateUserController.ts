import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../../domain/repositories/UserRepository';
import dynamoDbClient from '../../infrastructure/database/DynamoDBClient';
import { BadRequestError } from '../../infrastructure/errors/BadRequestError';
import { Transaction } from '../../domain/models/Transaction';
import { logger } from '../../infrastructure/utils/Logger';

const userRepository = new UserRepository(dynamoDbClient, logger);
const userService = new UserService(userRepository, logger);

export const validateUser = async (transaction: Transaction) => {
  logger.info('Received validate user request', { transaction });
  const { userId } = transaction;

  if (!userId) {
    logger.error('Validation Error: Missing userId');
    throw new BadRequestError('User ID is required');
  }

  await userService.validateUser(userId);
  logger.info('User validation completed', { userId });

  return transaction;
};

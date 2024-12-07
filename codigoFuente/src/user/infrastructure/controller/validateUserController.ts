import { UserRepository } from "../repositories/UserRepository";
import dynamoDbClient from "../db/DynamoDbClient";
import { TransactionDTO } from "../../domain/dto/transactionDto";
import { logger } from "../../../helper/logs/Logger";
import { UserService } from "../../application/UserService";

const userRepository = new UserRepository(dynamoDbClient, logger);
const userService = new UserService(userRepository, logger);

export const validateUser = async (transactionDto: TransactionDTO) => {
  logger.info(`information about transaction to process :`, transactionDto);

  logger.trace(`UserId to process ${transactionDto.userId} `);

  const result = await userService.validateUserId(transactionDto.userId);
  logger.info("UserId finished", { userId: transactionDto.userId });
  if(result){
    return {
      state: result,
      data: transactionDto,
    };
  }else{
    return {
      state: result,
      message: "UserId not found",
      data: transactionDto,
    };
  }

};

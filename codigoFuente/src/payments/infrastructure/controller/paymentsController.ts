import { Context } from "aws-lambda";
import axios from "axios";
import { PaymentService } from "../../aplication/PaymentService";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { Transaction } from "../../domain/entitys/transaction.entity";
import dynamoDbClient from "../db/DynamoDbClient";
import { logger } from "../../../helper/logs/Logger";

const paymentRepository = new PaymentRepository(axios, logger);
const transactionRepository = new TransactionRepository(dynamoDbClient, logger);

const paymentService = new PaymentService(
  paymentRepository,
  transactionRepository,
  logger
);

export const paymentTransaction = async (
  transaction: Transaction,
  context: Context
) => {
  logger.info("Executing payment", { transaction, context });

  const result = await paymentService.processPaymentTransaction(transaction);

  logger.info("Process state ", result);

  logger.info("Payment execution completed", {
    transaction: result,
  });

  return result;
};

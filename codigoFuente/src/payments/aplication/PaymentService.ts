import * as AWS from "aws-sdk";
import { ILogger } from "../../helper/logs/ILogger";
import { Transaction } from "../domain/entitys/transaction.entity";
import { IPaymentRepository } from "../domain/repositories/IPaymentRepository";
import { ITransactionRepository } from "../domain/repositories/ITransactionRepository";
import { IPaymentService } from "./IPaymentService";

const stepfunctions = new AWS.StepFunctions();

export class PaymentService implements IPaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private transactionRepository: ITransactionRepository,
    private logger: ILogger
  ) {}

  async startProcess(
    transaction: Transaction
  ): Promise<{ state: boolean; message: string; transaction: Transaction }> {
    const params = {
      stateMachineArn: process.env.STATE_FUNCTION || '',
      input: JSON.stringify(transaction),
    };

    try {
      this.logger.trace("Step Function execution started");
      const result = await stepfunctions.startExecution(params).promise();
      this.logger.info("Step Function execution finished", result);

      return {
        state: true,
        message: "Process finished correct",
        transaction: transaction,
      };
    } catch (error) {
      this.logger.error("Error starting startProcess", { error });
      return {
        state: false,
        message: "Error starting startProcess",
        transaction: transaction,
      };
    }
  }

  async processPaymentTransaction(
    transaction: Transaction
  ): Promise<Transaction> {
    this.logger.info("Starting processPayment", { transaction });

    this.logger.info("Validating transaction on API Mock", { transaction });
    await this.paymentRepository.savePayment(transaction);
    this.logger.info("Finish validating transaction on API Mock", {
      transaction,
    });

    this.logger.info("Transaction is ok, processing in BD", { transaction });

    const transactionDto = await this.transactionRepository.saveTransaction(
      transaction
    );
    this.logger.info("Transaction saved in BD", { transaction });

    this.logger.info("Payment processed successfully", {
      transaction: transactionDto,
    });
    return transactionDto;
  }
}

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { ILogger } from "../../../helper/logs/ILogger";
import { TransactionDTO } from "../../domain/dto/transaction.dto";
import { uuid } from "uuidv4";
import { Transaction } from "../../domain/entitys/transaction.entity";

export class TransactionRepository implements ITransactionRepository {
  private readonly tableName: string;

  private readonly dynamoDbClient: DocumentClient;

  private readonly logger: ILogger;

  constructor(dynamoDbClient: DocumentClient, logger: ILogger) {
    this.dynamoDbClient = dynamoDbClient;
    this.logger = logger;
    this.tableName = process.env.TRANSACTION_TABLE || '';
  }

  async saveTransaction(transaction: Transaction): Promise<TransactionDTO> {
    const transaccionDto = new TransactionDTO(
      uuid(),
      transaction.userId,
      transaction.paymentAmount
    );

    await this.dynamoDbClient
      .put({
        TableName: this.tableName,
        Item: transaccionDto,
      })
      .promise();

    this.logger.info(`Transaction saved: ${transaccionDto.transactionId}`);
    return transaccionDto;
  }
}

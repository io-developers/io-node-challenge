import AWS, { DynamoDB } from "aws-sdk";
import { Account, Transaction } from "../../../domain/interface/transaction.interface";
import { TransactionRepository } from "../../../domain/repository/transaction.repository";
import { injectable } from "inversify";
import { Logger } from "@aws-lambda-powertools/logger";
import { randomUUID } from "crypto";

const logger = new Logger({ serviceName: 'TransactionDynamoDBRepository' });

@injectable()
export class TransactionDynamoDBRepository implements TransactionRepository {
    private readonly dynamoDB: DynamoDB.DocumentClient;
    private readonly tableName: string;

    constructor() {
        try {
            logger.info('Initializing AccountDynamoDBRepository...');
            logger.info(`AWS_REGION: ${process.env.LAMBDA_AWS_REGION}`);
            logger.info(`TRANSACTION_TABLE_NAME: ${process.env.TRANSACTION_TABLE_NAME}`);

            // Configurar el SDK de AWS
            AWS.config.update({
                region: process.env.LAMBDA_AWS_REGION || 'us-east-1', // Especifica tu región
                accessKeyId: process.env.LAMBDA_AWS_ACCESS_KEY_ID, // Especifica tu Access Key ID
                secretAccessKey: process.env.LAMBDA_AWS_SECRET_ACCESS_KEY // Especifica tu Secret Access Key
            });

            this.dynamoDB = new DynamoDB.DocumentClient();
            this.tableName = process.env.TRANSACTION_TABLE_NAME || '';

            if (!this.tableName) {
                logger.error('TRANSACTION_TABLE_NAME environment variable is not defined');
                throw new Error('TRANSACTION_TABLE_NAME environment variable is not defined');
            }

            logger.info('TransactionDynamoDBRepository initialized successfully.');
        } catch (error) {
            logger.error(`Error initializing TransactionDynamoDBRepository: ${error}` );
            throw error;
        }
    }

    async createTransaction(dataTransaction: Transaction): Promise<Transaction> {
        try {
            const transaction: Transaction = {
                source: randomUUID(),
                id: dataTransaction.id,
                data: dataTransaction.data
            }
            const params = {
                TableName: this.tableName,
                Item: transaction
            };
            await this.dynamoDB.put(params).promise();
            return transaction;
        } catch (error) {
            logger.error(`Error creating transaction: ${error}`);
            throw error;
        }

    }

}
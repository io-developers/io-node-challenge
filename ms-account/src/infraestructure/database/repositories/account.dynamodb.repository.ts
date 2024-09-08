import AWS, { DynamoDB } from "aws-sdk";
import { Account } from "../../../domain/interface/account.interface";
import { AccountRepository } from "../../../domain/repository/account.repository";
import { injectable } from "inversify";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: 'AccountDynamoDBRepository' });

@injectable()
export class AccountDynamoDBRepository implements AccountRepository {
    private readonly dynamoDB: DynamoDB.DocumentClient;
    private readonly tableName: string;

    constructor() {
        try {
            logger.info('Initializing AccountDynamoDBRepository...');
            logger.info(`AWS_REGION: ${process.env.LAMBDA_AWS_REGION}`);
            logger.info(`ACCOUNT_TABLE_NAME: ${process.env.ACCOUNT_TABLE_NAME}`);

            // Configurar el SDK de AWS
            AWS.config.update({
                region: process.env.LAMBDA_AWS_REGION || 'us-east-1', // Especifica tu región
                accessKeyId: process.env.LAMBDA_AWS_ACCESS_KEY_ID, // Especifica tu Access Key ID
                secretAccessKey: process.env.LAMBDA_AWS_SECRET_ACCESS_KEY // Especifica tu Secret Access Key
            });

            this.dynamoDB = new DynamoDB.DocumentClient();
            this.tableName = process.env.ACCOUNT_TABLE_NAME || '';
            if (!this.tableName) {
                logger.error('ACCOUNT_TABLE_NAME environment variable is not defined');
                throw new Error('ACCOUNT_TABLE_NAME environment variable is not defined');
            }

            logger.info('AccountDynamoDBRepository initialized successfully.');
        } catch (error) {
            logger.error('Error initializing AccountDynamoDBRepository:', error as string | Error);
            throw error;
        }
    }

    async getAccount(id: string): Promise<Account> {
        const params = {
            TableName: this.tableName,
            Key: {
                id: id
            }
        };
        try {
            const result = await this.dynamoDB.get(params).promise();
            if (!result.Item) {
                logger.error(`Account not found: ${id}`);
                throw new Error('Account not found');
            }

            return result.Item as Account;
        } catch (error) {
            logger.error('Error getting account:', error as string | Error);
            throw error;
        }

    }

    async updateAccount(id: string, amount: number): Promise<void> {
        try {
            const params = {
                TableName: this.tableName,
                Key: {
                    id: id
                },
                UpdateExpression: 'SET amount = :amount',
                ExpressionAttributeValues: {
                    ':amount': amount
                }
            };

            await this.dynamoDB.update(params).promise();
        } catch (error) {
            logger.error('Error updating account:', error as string | Error);
            throw error;
        }

    }
}
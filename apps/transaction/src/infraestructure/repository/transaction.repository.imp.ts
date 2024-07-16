import { AttributeValue, DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Transaction } from "../../domain/entity/transaction";
import { ITransactionRepository } from "../../domain/repository/transaction.repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TransactionRepository implements ITransactionRepository {

    private readonly dynamoClient: DynamoDBClient = new DynamoDBClient()
    constructor(private readonly logger: Logger) { }

    async getTransaction(transactionId: string): Promise<Transaction> {
        this.logger.log('Start to get Transaction from DynamoDB', 'TransactionRepository - getTransaction');
        this.logger.log(`payload: ${transactionId}`, 'TransactionRepository - getTransaction');
        const command = new GetItemCommand({
            TableName: process.env.TABLE_TRANSACTION,
            Key: {
                "transactionId": {
                    "S": transactionId
                }
            },
        });
        this.logger.log(`Comand: ${JSON.stringify(command)}`, 'TransactionRepository - getTransaction');
        const {Item} = await this.dynamoClient.send(command);
        this.logger.log(`Item: ${JSON.stringify(Item)}`, 'TransactionRepository - getTransaction');
        if(Item) {
            return this.mapItemTransaction(Item)
        }
        return undefined;
    }

    private mapItemTransaction(item: Record<string, AttributeValue>): Transaction {
        return {
            amount: Number(item['amount'].N),
            transactionDescription: item['transactionDescription'].S,
            transactionId: item['transactionId'].S,
            userId: item['userId'].S,
        }
    }
}
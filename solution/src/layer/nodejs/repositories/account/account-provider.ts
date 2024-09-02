import { AccountRepository } from "./account-repository";
import { Account } from "../../models/account";
import { ACCOUNTS_TABLE_NAME } from "../../constants/constants";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export class AccountProvider implements AccountRepository {
    
    private tableName: string = ACCOUNTS_TABLE_NAME;

    constructor(private readonly dynamoDb: DynamoDBClient) {}

    async getAccount(account: string): Promise<Account | null> {
        try{
            const command = new GetItemCommand({
                TableName: this.tableName,
                Key: { 
                    accountId: { S: account }
                },
            });

            const result = await this.dynamoDb.send(command);
            
            if (result.Item) {
                return {
                    accountId: result.Item.accountId.S!,
                    amount: parseFloat(result.Item.amount.N!),
                } as Account;
            }

            return null;
        } catch (error) {
            console.error("Error fetching account from DynamoDB:", error);
            return null;
        }
    }

    async updateAccountBalance(accountId: string, newAmount: number): Promise<void> {
        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                accountId: { S: accountId },
            },
            UpdateExpression: "SET amount = :newAmount",
            ExpressionAttributeValues: {
                ":newAmount": { N: newAmount.toString() },
            },
        });

        await this.dynamoDb.send(command);
    }
}
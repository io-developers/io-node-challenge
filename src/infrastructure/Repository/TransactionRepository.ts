import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  endpoint: process.env.AWS_URL || "http://localhost.localstack.cloud:4566",
});
const tableName = process.env.TRANSACTIONS_TABLE_NAME || "transactions";

export interface Transaction {
  transactionId: string;
  userId: string;
  amount: number;
}
export class TransactionRepository {
  async insertTransaction(transaction: Transaction): Promise<any> {
    const params = {
      TableName: "transactions",
      Item: {
        transactionId: transaction.transactionId,
        userId: transaction.userId,
        amount: transaction.amount,
      },
    };
    try {
      const resp = await dynamoDb.put(params).promise();
      console.log("Transaction inserted successfully.");
      return resp;
    } catch (error) {
      console.error("Error inserting transaction:", error);
    }
  }

  async getTransaction(transactionId: string): Promise<any> {
    const params = {
      TableName: "transactions",
      Key: {
        transactionId: transactionId,
      },
    };

    const result = await dynamoDb.get(params).promise();
    return result.Item;
  }
}

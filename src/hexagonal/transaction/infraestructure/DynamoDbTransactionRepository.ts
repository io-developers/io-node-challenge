import { Transaction } from "../domain/Transaction";
import { TransactionRepository } from "../domain/TransactionRepository";
import { TransactionIdVo } from "../domain/value-object/transaction-id.vo";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand  } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDbTransactionRepository implements TransactionRepository {
 

  async create(transaction: Transaction): Promise<void> {
    const { source, id, data } = transaction.mapToPrimitives();
    const putParams = {
      TableName: "accounts",
      Item: {
        source,
        id,
        data,
      },
    };

    try {
      // Insertamos el nuevo ítem en DynamoDB
      await docClient.send(new PutCommand(putParams));
      console.log("payment successful");
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create account");
    }
  }

  getOneById(id: TransactionIdVo): Promise<Transaction | null> {
    throw new Error("Method not implemented.");
  }
  update(transaction: Transaction): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

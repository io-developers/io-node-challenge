import { Account } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountAmout } from "../domain/value-object/account-amout.vo";
import { AccountId } from "../domain/value-object/account-id.vo";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoDbAccountRepository implements AccountRepository {
  async getOneById(id: AccountId): Promise<Account | null> {
    // Fetch the item with the provided accountId
    const getParams = {
      TableName: "accounts",
      Key: { id: id },
    };

    try {
      const { Item } = await docClient.send(new GetCommand(getParams));

      if (!Item) {
        return null;
      }

      const acount = new Account(
        new AccountId(Item.id),
        new AccountAmout(Item.amount)
      );
      return acount;
    } catch (error) {
      console.error("Error fetching account", error);
      throw new Error("Failed to fetch account");
    }
  }
  async create(account: Account): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async update(account: Account): Promise<void> {
    const { id, amount } = account.mapToPrimitives();
    try {
      // Fetch the current account data

      // Extract and validate the current amount
      const currentAmount = amount ? amount : 0;
      if (isNaN(currentAmount)) {
        throw new Error("Invalid current amount value: NaN");
      }

      // Calculate the new total amount
      const newAmount = currentAmount + amount;

      const updateParams = {
        TableName: "accounts",
        Key: { id: id },
        UpdateExpression: "set amount = :newAmount",
        ExpressionAttributeValues: {
          ":newAmount": newAmount,
        },
      };
      await docClient.send(new UpdateCommand(updateParams));
      console.log("update acount");
    } catch (error) {
      console.log("error update acount");
    }
  }
}

import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { UserRepository } from "../domain/UserRepo";
import { User } from "../domain/User";
import { UserNotFound } from "../domain/UserNotFound";

export class DynamoUserRepo extends UserRepository {
  constructor (
    private readonly dynamoDb: DynamoDBClient,
    private readonly tableName: string
  ) {
    super();
  }

  async find(userId: string): Promise<User> {
    const result = await this.dynamoDb.send(new GetItemCommand({
      TableName: this.tableName,
      Key: {
        userId: { S: userId }
      }
    }));

    if (!result.Item) {
      throw new UserNotFound({ userId })
    }

    return <User> {
      userId: result.Item.userId.S,
      name: result.Item.name.S,
      lastName: result.Item.lastName.S
    }
  }
}
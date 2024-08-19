import { Injectable } from '@nestjs/common';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { UserService } from '@application/service/user.service';

@Injectable()
export class UserServiceHttp implements UserService {
  constructor(private readonly _dynamoDBClient: DynamoDBClient) {}

  async validateUser(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return !!user;
  }

  async getUserById(userId: string): Promise<any> {
    const params = {
      TableName: 'users',
      Key: {
        userId: { S: userId },
      },
    };

    const command = new GetItemCommand(params);
    const result = await this._dynamoDBClient.send(command);

    if (!result.Item) {
      return null;
    }

    return {
      userId: result.Item.userId.S,
      name: result.Item.name.S,
      lastName: result.Item.lastName.S,
    };
  }
}

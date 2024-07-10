import type { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FindUserQuery } from './app/FindUser/FindUserQuery';
import { FindUserQueryHandler } from './app/FindUser/FindUserQueryHandler';
import { DynamoUserRepo } from './infra/DynamoUserRepo';
import { CheckUserRequest } from './infra/CheckUserRequest';
import { Logger } from '../shared/Logger';

const dynamodb = new DynamoDBClient();

export const getUserHandler = async (event: APIGatewayEvent, _: Context): Promise<APIGatewayProxyResult> => {
    try {
      const params = CheckUserRequest.parse(JSON.stringify(event.queryStringParameters ?? {}));
      const repo = new DynamoUserRepo(dynamodb, process.env.USER_TABLE ?? 'users');
      const query = new FindUserQuery({ userId: params.userId });
      const findQueryHandler = new FindUserQueryHandler(repo);

      const { ok, err } = await findQueryHandler.handle(query);

      if (err) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: err.message,
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          userExists: !!ok,
        }),
      };
    } catch (error) {
      Logger.error(error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Failed to get user. Details: ${(error as Error).message}`
        }),
      };
    }
};

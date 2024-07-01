import type { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FindUserQuery } from './app/FindUser/FindUserQuery';
import { FindUserQueryHandler } from './app/FindUser/FindUserQueryHandler';
import { DynamoUserRepo } from './infra/DynamoUserRepo';
import { CheckUserRequest } from './infra/CheckUserRequest';

const dynamodb = new DynamoDBClient();

export const checkUserHandler = async (event: APIGatewayEvent, _: Context): Promise<APIGatewayProxyResult> => {
    try {
      const params = CheckUserRequest.parse(event.body ?? '{}');
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
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: (error as Error).message,
        }),
      };
    }
};

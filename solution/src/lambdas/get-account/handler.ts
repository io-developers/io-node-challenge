import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetAccountDependencyInjectionContainer } from "./get-account-di";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const diContainer = new GetAccountDependencyInjectionContainer();
  const getAccountUseCase = diContainer.getAccountUseCase;

  try {
    const accountId = event.pathParameters?.accountId;
    
    if (!accountId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing accountId" }),
      };
    }

    const account = await getAccountUseCase.getAccount(accountId)
    if (!account){
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Account not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ account: account }),
    };
  } catch (error) {
    console.error("Error fetching account:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
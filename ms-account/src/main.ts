import { APIGatewayProxyEvent } from "aws-lambda";
import { getAccountHandler } from "./infraestructure/handlers/get-account.handler";
// import { validateAccountHandler } from "./infraestructure/handlers/validate-account.handler";
//import { updateAccountHandler } from "./infraestructure/handlers/update-account.handler";


const event = {
  pathParameters: {
    id: '123e4567-e89b-12d3-a456-426614174000'
  },
  // body: JSON.stringify({
  //   amount: 120
  // })
};

getAccountHandler(event as unknown as APIGatewayProxyEvent).then(console.log).catch(console.error);
//updateAccountHandler(event as unknown as APIGatewayProxyEvent).then(console.log).catch(console.error);
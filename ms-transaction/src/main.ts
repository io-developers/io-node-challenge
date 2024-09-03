import { APIGatewayProxyEvent } from "aws-lambda";
import { createTransactionHandler } from "./infraestructure/handlers/create-transaction.handler";
// import { validateUserHandler } from "./infraestructure/handlers/validate-user.handler";


const event = {
  body: JSON.stringify({
    source: '123e4567-e89b-12d3-a456-426614171000',
    id: '10',
    data: {}
  })
};

// validateUserHandler(event as unknown as APIGatewayProxyEvent).then(console.log).catch(console.error);
createTransactionHandler(event as unknown as APIGatewayProxyEvent).then(console.log).catch(console.error);
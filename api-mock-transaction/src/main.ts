import { APIGatewayProxyEvent } from "aws-lambda";
import { transactionProcessHandler } from "./infraestructure/handlers/transaction-process.handler";

const event = {
  body: JSON.stringify({
    accountId: '1234',
    amount: 100
  })
};

transactionProcessHandler(event as unknown as APIGatewayProxyEvent).then(console.log).catch(console.error);
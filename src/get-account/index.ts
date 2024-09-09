import express from "express";
import { AccountController } from "../hexagonal/account/interface/AccountController";
import { DynamoDbAccountController } from "../hexagonal/account/interface/DynamoAccountController";

const controllerAcount = new AccountController();
const app = express();

app.use(express.json());

app.get("/v1/accounts/:id", controllerAcount.getOne);

export const handler = async (event) => {
  try {
    // Extract accountId from path parameters
    const accountId = event.pathParameters?.accountId;

    // Basic validation of accountId
    if (!accountId || typeof accountId !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid accountId. It must be a non-empty string.",
        }),
      };
    }

    const account = new DynamoDbAccountController();
    const responseAccount = await account.getOne(accountId);

    if (!responseAccount) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "accountId not found in the table." }),
      };
    }

    // Return the account data
    return responseAccount;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

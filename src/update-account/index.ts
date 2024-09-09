import { AccountController } from "../hexagonal/account/interface/AccountController";
import { DynamoDbAccountController } from "../hexagonal/account/interface/DynamoAccountController";

const controllerAcount = new AccountController();

export const handler = async (event) => {
  try {
    // Log the input event
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Extract accountId and amount from the DynamoDB stream event
    const record = event.Records[0];
    const accountId = record.dynamodb.NewImage.data.M.accountId.S;
    const amountStr = record.dynamodb.NewImage.data.M.amount.N;
    const amount = Number(amountStr);

    console.log("Extracted accountId:", accountId);
    console.log("Extracted amount:", amount);

    // Validate the input data types
    if (isNaN(amount)) {
      throw new Error("Invalid amount value: NaN");
    }

    const account = new DynamoDbAccountController();
    return await account.update(accountId, amount);
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

import { DynamoDbTransactionController } from "../hexagonal/transaction/infraestructure/DynamoDbTransactionController";

import { randomUUID } from "crypto";

export const handler = async (event) => {
  try {
    // Extract parameters from the event object
    const { accountId, amount } = event;
    console.log("Received event:", JSON.stringify(event, null, 2));

    console.log("Type of accountId:", typeof accountId);
    console.log("Type of amount:", typeof amount);

    // Validate the input data
    if (!accountId || typeof accountId !== "string" || isNaN(amount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid input. accountId must be a non-empty string and amount must be a valid number.",
        }),
      };
    }

    // Generate unique identifiers for the transaction
    // const source = randomUUID();
    const transaction = new DynamoDbTransactionController();
    const responseTransaction = await transaction.create(accountId, amount);
    const { source } = JSON.parse(responseTransaction.body);
    const id = randomUUID();

    // Return the generated identifiers
    return {
      statusCode: 201,
      source: source,
      id: id,
      amount: amount,
      body: JSON.stringify({
        message: "Payment registered successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

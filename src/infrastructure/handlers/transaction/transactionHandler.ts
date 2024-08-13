import { TransactionRepository } from "../../Repository/TransactionRepository";
import { TransactionUseCase } from "../../../application/use-cases/transaction.use-case";

const transactionService = new TransactionRepository();
const transactionUseCase = new TransactionUseCase(transactionService);

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const transactionId = event.queryStringParameters?.transactionId;

    if (!transactionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing transactionId query parameter",
        }),
      };
    }

    const result = await transactionUseCase.getTransaction(transactionId);

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Transaction not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error }),
    };
  }
};

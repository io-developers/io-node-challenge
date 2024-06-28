import pkg from "aws-sdk";
import { TABLE_TRANSACTIONS } from "./helpers/dynamo-helpers.mjs";
import { HTTP_CODES } from "./helpers/http/helpers-http.mjs";
const { DynamoDB } = pkg;

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log({ event });
  const transactionId = event.pathParameters.transactionId;

  const params = {
    TableName: TABLE_TRANSACTIONS,
    Key: {
      transactionId: transactionId
    }
  };

  try {
    const data = await dynamoDB.get(params).promise();

    if (data.Item) {
      return {
        statusCode: HTTP_CODES.OK,
        body: JSON.stringify(data.Item)
      };
    } else {
      return {
        statusCode: HTTP_CODES.NOT_FOUND,
        body: JSON.stringify({ message: "Transaction not found" })
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: "Error retrieving data from DynamoDB" })
    };
  }
};

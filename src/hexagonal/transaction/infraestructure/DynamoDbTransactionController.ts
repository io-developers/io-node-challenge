import { DependencyInjecttionContainer } from "../../DependencyInjecttionContainer";
import { TransactionNotFoundError } from "../domain/TransactionNotFoundError";
import { Request, Response, NextFunction } from "express";
import axios from "axios";
export class DynamoDbTransactionController {
  async getOne(id: string) {
    try {
      const transaction =
        await DependencyInjecttionContainer.transaction.getOne.execute(id);

      return {
        statusCode: 200,
        body: JSON.stringify({ ...transaction.mapToPrimitives() }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }

  async create(id: string, data: any) {
    try {
      console.log("execute payment");

      const urlExternal = `http://localhost:3010/api/process-payment`;
      const processPayment: any = await axios.post<{
        message: string;
        transactionId: string;
      }>(urlExternal, data);
      console.log("get data event", processPayment.data);

      const source = processPayment.data.transactionId;

      console.log("send payment external transaction");
      await DependencyInjecttionContainer.DTransaction.create.execute(
        source,
        id,
        data
      );
      console.log("response payment");

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "ok", source }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }
}

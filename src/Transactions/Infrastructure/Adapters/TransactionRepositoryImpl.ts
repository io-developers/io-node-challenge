import { Injectable } from "@nestjs/common";
import { Transaction } from "../../Domain/Entities/Transaction";
import { TransactionRepository } from "../../Domain/Ports/TransactionRepository";
import { DynamoDBUtils } from "../../../Commons/DynamoDBUtils";

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {

  createTransaction(transaction: Transaction): Promise<Transaction> {
    // TODO: implementar
    return Promise.resolve(transaction);
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    console.log('-- TransactionRepositoryImpl.getTransaction --');
    const tabla = process.env.DYNAMODB_TABLE_TRANSACTIONS;
    const params = {
      TableName: tabla,
      Key: {
        transactionId: transactionId
      }
    };
    const result = await DynamoDBUtils.getItem(params);
    return result ? result as Transaction : null;
  }

}
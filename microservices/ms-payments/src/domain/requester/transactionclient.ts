import { Transaccion } from "../entities/transaction.entity";

export interface ITransactionClient {
  executeTransactionMock(userId: string): Promise<Transaccion>
}
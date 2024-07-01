import { EventDomain } from "../../shared/EventHandler";
import { Transaction } from "./Transaction";

export class TransactionCreated extends EventDomain {
  constructor (
    private readonly transaction: Transaction
  ) {
    super();
  }

  getTransaction(): Transaction {
    return this.transaction;
  }
}
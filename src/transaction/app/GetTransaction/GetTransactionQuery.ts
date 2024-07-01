import { Query } from "../../../shared/QueryHandler";

export class GetTransactionQuery extends Query {
  private transactionId: string;

  constructor(params: { transactionId: string }) {
    super();

    this.transactionId = params.transactionId;
  }

  getTransactionId(): string {
    return this.transactionId;
  }
}
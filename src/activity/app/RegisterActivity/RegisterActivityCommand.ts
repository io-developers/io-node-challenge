import { Command } from "../../../shared/CommandHandler";

export class RegisterActivityCommand extends Command {
  private readonly transactionId: string;

  constructor(params: {
    readonly transactionId: string,
  }) {
    super();

    this.transactionId = params.transactionId;
  }

  getTransactionId(): string {
    return this.transactionId;
  }
}
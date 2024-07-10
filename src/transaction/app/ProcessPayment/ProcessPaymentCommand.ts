import { Command } from "../../../shared/CommandHandler";

export class ProcessPaymentCommand extends Command {
  private userId: string;

  private amount: number;

  constructor (params: {
    userId: string;
    amount: number;
  }) {
    super();

    this.userId = params.userId;
    this.amount = params.amount;
  }

  getUserId(): string {
    return this.userId;
  }

  getAmount(): number {
    return this.amount;
  }
}
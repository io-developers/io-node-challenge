import { randomUUID } from "crypto";
import { CommandHandler } from "../../../shared/CommandHandler";
import { Result } from "../../../shared/Result";
import { Transaction } from "../../domain/Transaction";
import { TransactionFailed } from "../../domain/TransactionFailed";
import { TransactionRepository } from "../../domain/TransactionRepo";
import { ProcessPaymentCommand } from "./ProcessPaymentCommand";
import { PaymentProcessorSdk } from "../../infra/PaymentProcessorSdk";
import { EventPublisher } from "../../../shared/EventPublisher";
import { TransactionCreated } from "../../domain/TransactionCreated";

export class ProcessPaymentCommandHandler implements CommandHandler<Result<Transaction, TransactionFailed>> {
  constructor(
    private eventPublisher: EventPublisher,
    private paymentProcessorSdk: PaymentProcessorSdk,
    private transactionRepository: TransactionRepository
  ) {
    this.transactionRepository = transactionRepository;
  }

  async handle(command: ProcessPaymentCommand) {
    try {
      const paymentProcessed = await this.paymentProcessorSdk.processPayment({
        userId: command.getUserId(),
        amount: command.getAmount()
      });

      if (! paymentProcessed) {
        return {
          ok: null,
          err: new TransactionFailed(`Payment processor failed for user ${command.getUserId()}`)
        }
      }

      const transaction = <Transaction> {
        transactionId: randomUUID(),
        userId: command.getUserId(),
        amount: command.getAmount(),
      };

      await this.transactionRepository.save(transaction);
      await this.eventPublisher.publish(new TransactionCreated(transaction));

      return {
        ok: transaction,
        err: null
      }
    } catch (e) {
      const err = e as Error;

      return {
        ok: null,
        err: new TransactionFailed(`Failed to process payment. Details: ${err.message}`)
      }
    }
  }
}
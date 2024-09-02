import {ProcessPaymentUseCase} from "../use-cases/ProcessPaymentUseCase";
import {Transaction} from "../../domain/entities/Transaction";

export class PaymentService {
  private processPaymentUseCase: ProcessPaymentUseCase;

  constructor(processPaymentUseCase: ProcessPaymentUseCase) {
    this.processPaymentUseCase = processPaymentUseCase;
  }

  /**
   * Executes the payment process.
   *
   * @param transactionData - Data required for processing the payment.
   * @returns The result of the payment process.
   */
  async executePayment(transactionData: {
    accountId: string;
    amount: number;
  }): Promise<Transaction> {
    try {
      // Extraer los parámetros necesarios del objeto transactionData
      const {accountId, amount} = transactionData;

      // Llama al caso de uso con los parámetros correctos
      return await this.processPaymentUseCase.execute(accountId, amount);
    } catch (error) {
      // Log del error y relanza para manejo externo
      console.error('Error executing payment:', error);
      throw error;
    }
  }
}

import { HttpApi } from "../../shared/HttpApi";
import { Logger } from "../../shared/Logger";

export class PaymentProcessorSdk {
  constructor (
    private readonly httpApi: HttpApi
  ) {}

  async processPayment (params: { userId: string; amount: number }): Promise<boolean> {
    Logger.info(`[MockPaymentProcessorSdk] Processing payment for user [${params.userId}`);

    try {
      await this.httpApi.post('/payment', params);

      return true;
    } catch {
      return false;
    }
  }
}
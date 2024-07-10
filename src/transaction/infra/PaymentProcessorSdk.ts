import { HttpApi } from "../../shared/HttpApi";
import { Logger } from "../../shared/Logger";

export class PaymentProcessorSdk {
  constructor (
    private readonly httpApi: HttpApi
  ) {}

  async processPayment (params: { userId: string; amount: number }): Promise<boolean> {
    Logger.info(`[PaymentProcessorSdk] Processing payment for user [${params.userId}`);

    try {
      await this.httpApi.post('/v1/payment-processor', params);

      return true;
    } catch {
      return false;
    }
  }
}
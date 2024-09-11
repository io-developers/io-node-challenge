import { ExternalApiRepository } from '../repositories/externalApiRepository';
import { PaymentResponse } from '../utils/types';

interface PaymentRequestRequest {
  accountId: string;
  amount: number;
}
export class ExecutePaymentUseCaseUseCase {
  private externalApiRepository: ExternalApiRepository;

  constructor(externalApiRepository: ExternalApiRepository) {
    this.externalApiRepository = externalApiRepository;
  }

  async execute(message: PaymentRequestRequest): Promise<PaymentResponse> {
      const response = await this.externalApiRepository.sendMessageToApi(message);
      const responseApi: PaymentResponse={
          source:message.accountId,
          id:response.transactionId,
          data: message
      }

      return responseApi;
  }
}




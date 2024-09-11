import { HttpClient } from '../dependencyInjectionContainer/paymentGatewayClient';
import { v4 as uuidv4 } from 'uuid';

export interface ExternalApiResponse {
  transactionId: string;
}

export interface ExternalApiRepository {
  sendMessageToApi(message: any): Promise<ExternalApiResponse>;
}

export class ExternalApiRepositoryImpl implements ExternalApiRepository {
  private httpClient: HttpClient;
  private apiUrl: string;

  constructor(httpClient: HttpClient, apiUrl: string) {
    this.httpClient = httpClient;
    this.apiUrl = apiUrl;
  }

  async sendMessageToApi(message: any): Promise<ExternalApiResponse> {
      //const response = await this.httpClient.post<ExternalApiResponse>(this.apiUrl, message);
      const responseApi: ExternalApiResponse={
          transactionId: uuidv4()
      }
    return responseApi;
  }
}

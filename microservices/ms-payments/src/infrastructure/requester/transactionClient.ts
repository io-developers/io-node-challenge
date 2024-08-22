import axios from 'axios';
import { Transaccion } from '../../domain/entities/transaction.entity';
import { ITransactionClient } from '../../domain/requester/transactionclient';
import { ILogger } from '../../domain/interfaces/ILogger';

export class TransactionClient implements ITransactionClient {
  private readonly apiUrl: string;
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.apiUrl = process.env.API_MOCK_URL || "";
    this.logger = logger;
  }

  async executeTransactionMock(userId: string): Promise<Transaccion> {

    const response = await axios.post(`${this.apiUrl}`, { userId });

    this.logger.info(`[ExecuteTransactionMock] execute process transaction mock for user ${userId} with response: ${JSON.stringify(response.data)}`);
    return response.data;
  }
}

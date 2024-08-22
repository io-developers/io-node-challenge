import axios from 'axios';
import { ILogger } from '../../../src/domain/interfaces/ILogger';
import { TransactionClient } from '../../../src/infrastructure/requester/transactionClient';
import { Transaccion } from '../../../src/domain/entities/transaction.entity';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('payment.service.handler', () => {
  let logger: ILogger;
  let transactionClient: TransactionClient;

  beforeEach(() => {
    logger = { info: jest.fn() } as unknown as ILogger;
    transactionClient = new TransactionClient(logger);
  });

  it('should return transaction data successfully', async () => {
    // Datos mockeados
    const mockTransaction: Transaccion = {
      userId: 'user123',
      transactionId: 'txn123456',
      status: 'success'
    };

    // Configurar el mock de axios
    mockedAxios.post.mockResolvedValue({ data: mockTransaction });

    const userId = 'user123';
    const result = await transactionClient.executeTransactionMock(userId);

    expect(result).toEqual(mockTransaction);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      ``,
      { userId }
    );
  });

  it('should handle errors correctly', async () => {
    // Configurar el mock de axios para lanzar un error
    mockedAxios.post.mockRejectedValue(new Error('API call failed'));

    const userId = 'user123';

    await expect(transactionClient.executeTransactionMock(userId)).rejects.toThrow('API call failed');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      ``,
      { userId }
    );
  });
});

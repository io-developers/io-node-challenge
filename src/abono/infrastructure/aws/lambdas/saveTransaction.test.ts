import {handler} from './saveTransaction'; // Ajusta el path al archivo correcto
import {DynamoDB} from 'aws-sdk';

// Mocks
jest.mock('aws-sdk', () => {
  const DynamoDB = {
    DocumentClient: jest.fn(() => ({
      put: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValue({}),
    })),
  };
  return {DynamoDB};
});

describe('Transaction Lambda', () => {
  const event = {
    id: '123',
    accountId: '456',
    amount: 100,
    type: 'deposit',
    status: 'pending',
    createdAt: '2024-09-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe guardar la transacción y devolver el ID de la transacción.', async () => {
    const result = await handler(event);

    expect(DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledWith({
      TableName: process.env.TRANSACTIONS_TABLE,
      Item: event,
    });
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({source: event.id}),
    });
  });
});

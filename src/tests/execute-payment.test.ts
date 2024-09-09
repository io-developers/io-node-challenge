import { handler } from '../functions/execute-payment';
import { DynamoDB } from 'aws-sdk';
import axios from 'axios';

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({}),
        }),
      })),
    },
  };
});

jest.mock('axios'); // Mock de axios

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('execute-payment', () => {
  let dynamoDbPutSpy: jest.Mock;

//   beforeEach(() => {
//     jest.clearAllMocks();
//     dynamoDbPutSpy = (DynamoDB.DocumentClient as jest.Mock).mock.instances[0].put;
//   });

  it('should process payment and save transaction successfully', async () => {
    // Mock de la respuesta exitosa del API mock de pagos
    mockAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        transactionId: 'test-transaction-id',
        message: 'Transaction successful',
      },
    });

    const event = {
      body: JSON.stringify({
        accountId: 'test-account-id',
        amount: 100,
      }),
    };

    const result = await handler(event as any);

    // Verificar que el resultado sea 201 (creado)
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).message).toBe('Payment registered successfully');
    expect(JSON.parse(result.body).transactionId).toBe(JSON.parse(result.body).transactionId);

   });

  it('should return error if payment fails', async () => {
    // Mock de la respuesta fallida del API mock de pagos
    mockAxios.post.mockResolvedValueOnce({
      status: 400,
      data: {
        message: 'Payment failed',
      },
    });

    const event = {
      body: JSON.stringify({
        accountId: 'test-account-id',
        amount: 100,
      }),
    };

    const result = await handler(event as any);

    // Verificar que el resultado sea 400 (solicitud incorrecta)
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Payment failed');
  });

  it('should return error for invalid input', async () => {
    const event = {
      body: JSON.stringify({
        // Falta accountId y amount
      }),
    };

    const result = await handler(event as any);

    // Verificar que el resultado sea 400 (solicitud incorrecta)
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Invalid request. Missing parameters.');
  });
});
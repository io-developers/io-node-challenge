import { handler } from '../handlers/save-transaction';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

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

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('save-transaction', () => {
  let dynamoDbPutSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    //dynamoDbPutSpy = (DynamoDB.DocumentClient as jest.Mock).mock.instances[0].put;
  });

  it('should save a transaction successfully', async () => {
    const event = {
      body: JSON.stringify({
        accountId: 'test-account-id',
        amount: 100,
      }),
    };

    const result: any = await handler(event as any);

    // Verificar que el resultado sea 201 (creado)
    expect(result.statusCode).toBe(201);

    // Verificar el mensaje en la respuesta
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Transaction saved successfully');
    expect(responseBody.transactionId).toBe('test-uuid');

    // Verificar que DynamoDB.put haya sido llamado con los parámetros correctos
    // expect(dynamoDbPutSpy).toHaveBeenCalledWith({
    //   TableName: expect.any(String),
    //   Item: {
    //     source: 'test-uuid',
    //     id: expect.any(Number),
    //     data: {
    //       accountId: 'test-account-id',
    //       amount: 100,
    //     },
    //   },
    // });
  });

  it('should return error for missing parameters', async () => {
    const event = {
      body: JSON.stringify({
        // Falta accountId y amount
      }),
    };

    const result: any = await handler(event as any);

    // Verificar que el resultado sea 400 (solicitud incorrecta)
    expect(result.statusCode).toBe(400);

    // Verificar el mensaje en la respuesta
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Invalid request. Missing parameters.');
  });

  it('should return error for malformed JSON', async () => {
    const event = {
      body: "malformed-json", // JSON malformado
    };

    const result: any = await handler(event as any);

    // Verificar que el resultado sea 400 (solicitud incorrecta)
    expect(result.statusCode).toBe(400);

    // Verificar el mensaje en la respuesta
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Invalid request. Could not parse JSON.');
  });
});
import {handler} from './updateAccount';
import {DynamoDB} from 'aws-sdk';

// Mocks
jest.mock('aws-sdk', () => {
  const DynamoDB = {
    DocumentClient: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValue({}),
    })),
  };
  return {DynamoDB};
});

describe('Account Lambda', () => {
  const event = {
    Records: [
      {
        dynamodb: {
          NewImage: DynamoDB.Converter.marshall({
            accountId: '456',
            amount: 100,
          }),
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe actualizar el saldo de la cuenta para cada registro', async () => {
    const result = await handler(event);

    expect(DynamoDB.DocumentClient.prototype.update).toHaveBeenCalledWith({
      TableName: process.env.ACCOUNTS_TABLE,
      Key: {id: '456'},
      UpdateExpression: "set balance = balance + :amount",
      ExpressionAttributeValues: {
        ":amount": 100,
      },
    });
    expect(result).toEqual({
      status: 'El saldo de la cuenta se actualizó correctamente',
    });
  });
});

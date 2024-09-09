import { handler } from '../functions/update-account';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        update: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({}),
        }),
      })),
    },
  };
});

describe('update-account', () => {
  it('should update account balance based on transaction', async () => {
    const event = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: 'test-account-id' },
                  amount: { N: '100' },
                },
              },
            },
          },
        },
      ],
    };

    const result = await handler(event as any);

    // Verificar que se haya llamado a DynamoDB para actualizar la cuenta
    const updateSpy = (DynamoDB.DocumentClient as jest.Mock).mock.instances[0].update;
    expect(updateSpy).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Key: { id: 'test-account-id' },
      UpdateExpression: 'set amount = amount + :val',
      ExpressionAttributeValues: {
        ':val': 100,
      },
    });
  });

  it('should handle multiple transactions', async () => {
    const event = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: 'test-account-id-1' },
                  amount: { N: '50' },
                },
              },
            },
          },
        },
        {
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: 'test-account-id-2' },
                  amount: { N: '150' },
                },
              },
            },
          },
        },
      ],
    };

    await handler(event as any);

    // Verificar que se hayan procesado ambos eventos
    const updateSpy = (DynamoDB.DocumentClient as jest.Mock).mock.instances[0].update;
    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(updateSpy).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Key: { id: 'test-account-id-1' },
      UpdateExpression: 'set amount = amount + :val',
      ExpressionAttributeValues: {
        ':val': 50,
      },
    });
    expect(updateSpy).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Key: { id: 'test-account-id-2' },
      UpdateExpression: 'set amount = amount + :val',
      ExpressionAttributeValues: {
        ':val': 150,
      },
    });
  });
});
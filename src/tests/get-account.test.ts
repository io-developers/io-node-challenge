import { handler } from '../functions/get-account';
import { DynamoDB } from 'aws-sdk';

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        get: jest.fn().mockReturnValue({
          promise: jest.fn(),
        }),
      })),
    },
  };
});

describe('get-account', () => {
  let dynamoDbGetSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    //dynamoDbGetSpy = (DynamoDB.DocumentClient as jest.Mock).mock.instances[0].get;
  });

  it('should return the account when it exists', async () => {
    // dynamoDbGetSpy.mockReturnValueOnce({
    //   promise: jest.fn().mockResolvedValue({
    //     Item: {
    //       id: '959as5-5454q-5asd1-t41e2-s4sd4w4erqe',
    //       amount: 100,
    //     },
    //   }),
    // });

    const event = {
      pathParameters: {
        accountId: '959as5-5454q-5asd1-t41e2-s4sd4w4erqe',
      },
    };

    const result = await handler(event as any);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: '959as5-5454q-5asd1-t41e2-s4sd4w4erqe',
      amount: 100,
    });
  });

  it('should return 404 if account is not found', async () => {
    // dynamoDbGetSpy.mockReturnValueOnce({
    //   promise: jest.fn().mockResolvedValue({}),
    // });

    const event = {
      pathParameters: {
        accountId: 'non-existent-account-id',
      },
    };

    const result = await handler(event as any);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Account not found');
  });

  it('should return 400 if accountId is missing', async () => {
    const event = {
      pathParameters: {},
    };

    const result = await handler(event as any);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Account ID is required');
  });

  it('should return 500 if there is an error querying DynamoDB', async () => {
    // dynamoDbGetSpy.mockReturnValueOnce({
    //   promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
    // });

    const event = {
      pathParameters: {
        accountId: 'test-account-id',
      },
    };

    const result = await handler(event as any);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
  });
});
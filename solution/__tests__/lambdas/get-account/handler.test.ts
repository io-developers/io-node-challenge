import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/lambdas/get-account/handler';

jest.mock('@aws-sdk/lib-dynamodb');

describe('Lambda handler', () => {
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    DynamoDBDocumentClient.prototype.send = mockSend;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the item when the item is found', async () => {
    const mockItem = { id: '123', name: 'Test Item' };
    mockSend.mockResolvedValue({ Item: mockItem });

    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: '123',
      },
    };

    const response = await handler(event as APIGatewayProxyEvent) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockItem);
    expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));
  });

  it('should return 404 when the item is not found', async () => {
    mockSend.mockResolvedValue({});

    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: '123',
      },
    };

    const response = await handler(event as APIGatewayProxyEvent) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ message: 'Item not found' });
    expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));
  });

  it('should return 500 when there is an error retrieving the item', async () => {
    mockSend.mockRejectedValue(new Error('Something went wrong'));

    const event: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: '123',
      },
    };

    const response = await handler(event as APIGatewayProxyEvent) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ message: 'Could not retrieve item', error: 'Something went wrong' });
    expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));
  });
});
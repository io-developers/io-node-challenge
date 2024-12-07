const { registerActivity } = require('../src/handlers/register-activity/register-activity'); // Ajusta la ruta según tu estructura de archivos
const dynamodb = require('../src/db/db');

jest.mock('../src/db/db', () => ({
  put: jest.fn(),
}));

describe('registerActivity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register activity successfully', async () => {
    const event = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              transactionId: { S: 'transaction123' },
              userId: { S: 'user123' },
            },
          },
        },
      ],
    };

    const mockPutResponse = {};
    dynamodb.put.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(mockPutResponse),
    });

    await registerActivity(event);

    expect(dynamodb.put).toHaveBeenCalledTimes(1);
    expect(dynamodb.put).toHaveBeenCalledWith({
      TableName: 'activity',
      Item: {
        activityId: expect.any(String),
        transactionId: 'transaction123',
        date: expect.any(String),
        detail: 'Transaction transaction123 for user user123 registered.',
      },
    });
  });

  it('should handle error when registering activity fails', async () => {
    const event = {
      Records: [
        {
          dynamodb: {
            NewImage: {
              transactionId: { S: 'transaction123' },
              userId: { S: 'user123' },
            },
          },
        },
      ],
    };

    const errorMessage = 'DynamoDB error';
    dynamodb.put.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    await registerActivity(event);

    expect(consoleErrorMock).toHaveBeenCalledWith('Error registering activity:', errorMessage);
  });
});

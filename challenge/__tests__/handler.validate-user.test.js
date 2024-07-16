const { validateUser } = require('../src/handlers/validate-user/validate-user'); // Ajusta la ruta según tu estructura de archivos
const dynamodb = require('../src/db/db');

jest.mock('../src/db/db', () => ({
  get: jest.fn(),
}));

describe('validateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and message if user exists', async () => {
    const userId = 'user123';
    const event = {
      body: JSON.stringify({ userId }),
    };
    const mockResponse = {
      Item: { userId: 'user123' },
    };
    dynamodb.get.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await validateUser(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('User exists');
    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: 'users',
      Key: {
        userId: 'user123',
      },
    });
  });

  it('should return 404 and message if user does not exist', async () => {
    const userId = 'user456';
    const event = {
      body: JSON.stringify({ userId }),
    };
    const mockResponse = {
      Item: null, // Simula que el usuario no existe en DynamoDB
    };
    dynamodb.get.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await validateUser(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('User not found');
    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: 'users',
      Key: {
        userId: 'user456',
      },
    });
  });

  it('should return 500 and error message on DynamoDB error', async () => {
    const userId = 'user789';
    const event = {
      body: JSON.stringify({ userId }),
    };
    const errorMessage = 'Database error';
    dynamodb.get.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    const result = await validateUser(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal Server Error');
    expect(JSON.parse(result.body).error).toBe(errorMessage);
    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: 'users',
      Key: {
        userId: 'user789',
      },
    });
  });
});

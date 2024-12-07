const { getTransaction } = require('../src/handlers/get-transaction/get-transaction'); // Ajusta la ruta según tu estructura de archivos
const dynamodb = require('../src/db/db');

jest.mock('../src/db/db', () => ({
  get: jest.fn(),
}));

describe('getTransaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and transaction record if transaction exists', async () => {
    const transactionId = 'transaction123';
    const event = {
      queryStringParameters: {
        transaction_id: transactionId,
      },
    };
    const mockResponse = {
      Item: {
        transactionId: 'transaction123',
        amount: 100,
        status: 'completed',
      }, // Simula que la transacción existe en DynamoDB
    };
    dynamodb.get.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getTransaction(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockResponse.Item);
    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: 'transactions',
      Key: {
        transactionId: 'transaction123',
      },
    });
  });

  it('should return 404 and message if transaction does not exist', async () => {
    const transactionId = 'transaction456';
    const event = {
      queryStringParameters: {
        transaction_id: transactionId,
      },
    };
    const mockResponse = {
      Item: null, // Simula que la transacción no existe en DynamoDB
    };
    dynamodb.get.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getTransaction(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('Transacción no encontrado');
    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: 'transactions',
      Key: {
        transactionId: 'transaction456',
      },
    });
  });

  it('should return 500 and error message on DynamoDB error', async () => {
    const transactionId = 'transaction789';
    const event = {
      queryStringParameters: {
        transaction_id: transactionId,
      },
    };
    const errorMessage = 'Database error';
    dynamodb.get.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    const result = await getTransaction(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Error interno del servidor');
    expect(JSON.parse(result.body).error).toBe(errorMessage);
    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: 'transactions',
      Key: {
        transactionId: 'transaction789',
      },
    });
  });
});
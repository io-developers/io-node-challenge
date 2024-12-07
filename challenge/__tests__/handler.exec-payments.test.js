const { executePayments } = require('../src/handlers/exec-payments/exec-payments');
const axios = require('axios');
const dynamodb = require('../src/db/db');
const { v4: uuidv4 } = require('uuid');

jest.mock('axios');

jest.mock('../src/db/db', () => ({
  put: jest.fn(),
}));

describe('executePayments', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 201 and transactionId if payment succeeds', async () => {
      const event = {
        body: JSON.stringify({
          userId: 'user123',
          amount: 100,
        }),
      };
      const mockResponse = {
        data: {
          status: 'success',
          transactionId: uuidv4(),
        },
      };
      axios.post.mockResolvedValueOnce(mockResponse);
  
      const mockPutResponse = {};
      dynamodb.put.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce(mockPutResponse),
      });
  
      const result = await executePayments(event);
      console.log({ result: JSON.stringify(result) });
  
      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body).message).toBe('Payment registered successfully');
      expect(JSON.parse(result.body).transactionId).toBeTruthy();
      expect(dynamodb.put).toHaveBeenCalled();
    });
  
    it('should return 400 if payment status is not success', async () => {
      const event = {
        body: JSON.stringify({
          userId: 'user123',
          amount: 100,
        }),
      };
      const mockResponse = {
        data: {
          status: 'failure',
        },
      };
      axios.post.mockResolvedValueOnce(mockResponse);
  
      const result = await executePayments(event);
  
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).message).toBe('Something was wrong');
      expect(dynamodb.put).not.toHaveBeenCalled();
    });
  
    it('should return 500 on axios error', async () => {
      const event = {
        body: JSON.stringify({
          userId: 'user123',
          amount: 100,
        }),
      };
      const errorMessage = 'Axios error';
      axios.post.mockRejectedValueOnce(new Error(errorMessage));
  
      const result = await executePayments(event);
  
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Internal Server Error');
      expect(JSON.parse(result.body).error).toBe(errorMessage);
      expect(dynamodb.put).not.toHaveBeenCalled();
    });
  
    it('should return 500 on DynamoDB error', async () => {
      const event = {
        body: JSON.stringify({
          userId: 'user123',
          amount: 100,
        }),
      };
      const mockResponse = {
        data: {
          status: 'success',
        },
      };
      axios.post.mockResolvedValueOnce(mockResponse);
  
      const errorMessage = 'DynamoDB error';
      dynamodb.put.mockReturnValueOnce({
        promise: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      });
  
      const result = await executePayments(event);
  
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Internal Server Error');
      expect(JSON.parse(result.body).error).toBe(errorMessage);
      expect(dynamodb.put).toHaveBeenCalled();
    });
  });
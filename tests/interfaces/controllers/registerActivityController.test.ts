import { DynamoDBStreamEvent, Context, Callback } from 'aws-lambda';
import { ActivityService } from '../../../src/application/services/ActivityService';
import { InternalServerError } from '../../../src/infrastructure/errors/DatabaseError';
import { logger } from '../../../src/infrastructure/utils/Logger';
import { registerActivityController } from '../../../src/interfaces/controllers/registerActivityController';

jest.mock('../../../src/application/services/ActivityService');
jest.mock('../../../src/infrastructure/utils/Logger');

describe('registerActivityController', () => {
  let mockEvent: DynamoDBStreamEvent;
  let mockContext: Context;
  let mockCallback: Callback;

  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      Records: [
        {
          eventID: '1',
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              transactionId: { S: 'test-transaction-id' },
            },
          },
          awsRegion: 'us-west-2',
          eventSource: 'aws:dynamodb',
        },
      ],
    } as unknown as DynamoDBStreamEvent;

    mockContext = {} as Context;
    mockCallback = jest.fn();

    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  test('should process DynamoDB stream event and register activity successfully', async () => {
    const mockActivityService = jest.mocked(ActivityService.prototype);
    mockActivityService.recordActivity.mockResolvedValueOnce(undefined);

    await registerActivityController(mockEvent, mockContext, mockCallback);

    expect(mockActivityService.recordActivity).toHaveBeenCalledWith('test-transaction-id');
    expect(logger.info).toHaveBeenCalledWith('Processing DynamoDB stream event', { event: mockEvent });
    expect(logger.info).toHaveBeenCalledWith('Activity registered for transaction: test-transaction-id');
  });

  test('should log error and throw InternalServerError if recordActivity fails', async () => {
    const mockActivityService = jest.mocked(ActivityService.prototype);
    const mockError = new Error('Database error');
    mockActivityService.recordActivity.mockRejectedValueOnce(mockError);

    try {
      await registerActivityController(mockEvent, mockContext, mockCallback);
    } catch (error) {
      expect(mockActivityService.recordActivity).toHaveBeenCalledWith('test-transaction-id');
      expect(logger.error).toHaveBeenCalledWith('Error in registering activity', { error: mockError });
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe('Error in registering activity: Database error');
    }
  });

  test('should log error if transactionId is not found in DynamoDB stream record', async () => {
    mockEvent.Records[0].dynamodb!.NewImage = {};

    await registerActivityController(mockEvent, mockContext, mockCallback);

    expect(logger.error).toHaveBeenCalledWith('Transaction ID not found in DynamoDB stream record', { record: mockEvent.Records[0] });
    expect(ActivityService.prototype.recordActivity).not.toHaveBeenCalled();
  });
});

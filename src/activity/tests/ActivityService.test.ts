import { DynamoDBStreamEvent } from 'aws-lambda';
import { registerActivity } from '../infrastructure/ActivityController';
import { DynamoDBActivityRepository } from '../infrastructure/DynamoDBActivityRepository';

jest.mock('../infrastructure/DynamoDBActivityRepository');

describe('ActivityService', () => {
  it('should process DynamoDB stream event and register activity', async () => {
    const mockSave = jest.fn();
    DynamoDBActivityRepository.prototype.save = mockSave;

    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              transactionId: { S: 'test-transaction-id' },
            },
          },
        },
      ],
    };

    await registerActivity(event);

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionId: 'test-transaction-id',
      }),
    );
  });
});

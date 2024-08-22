import { ActivityService } from '../../src/application/services/activity.service';
import { handler } from '../../src/application/handlers/handler';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { ILogger } from '../../src/domain/interfaces/ILogger';


jest.mock('../../src/application/services/activity.service');

describe('application.handler.test', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should add activity for INSERT event', async () => {
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventID: "1",
          eventName: "INSERT",
          dynamodb: {
            NewImage: {
              transactionId: { S: "345345-34534-5345" },
            },
          },
          awsRegion: "us-west-1",
          eventSource: "aws:dynamodb",
        },
      ],
    }

    const mockAdd = jest.mocked(ActivityService.prototype.add).mockResolvedValueOnce();

    await handler(event);

    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({
      activityId: expect.any(String),
      transactionId: '345345-34534-5345',
      date: expect.any(String),
    });
  });

  it('should not add activity for non-INSERT event', async () => {

    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventID: "1",
          eventName: "REMOVE",
          dynamodb: {
            NewImage: {
              transactionId: { S: "345345-34534-5345" },
            },
          },
          awsRegion: "us-west-1",
          eventSource: "aws:dynamodb",
        },
      ],
    }

    const mockAdd = jest.mocked(ActivityService.prototype.add).mockResolvedValueOnce();

    await handler(event);

    expect(mockAdd).toHaveBeenCalledTimes(0);
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('should handle errors and throw', async () => {
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventID: "1",
          eventName: "INSERT",
          dynamodb: {
            NewImage: {
              transactionId: { S: "345345-34534-5345" },
            },
          },
          awsRegion: "us-west-1",
          eventSource: "aws:dynamodb",
        },
      ],
    }
    const mockError = new Error('Test error');
    const mockAdd = jest.mocked(ActivityService.prototype.add).mockRejectedValueOnce(mockError);

    await expect(handler(event)).rejects.toThrow(mockError);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });
});
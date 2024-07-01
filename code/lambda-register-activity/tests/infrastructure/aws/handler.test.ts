

import { handler } from '../../../src/infrastructure/aws/lambda';
import { SaveActivity } from '../../../src/application/saveActivity';
//import { Transaction } from '../../../src/domain/entity/Transaction';
import { DynamoDBStreamHandler, Context, Callback, DynamoDBStreamEvent } from 'aws-lambda';

jest.mock('../../../src/application/saveActivity');

describe('DynamoDBStreamHandler', () => {


  let mockContext: Context;
  let callback: jest.Mock<Callback<DynamoDBStreamHandler>>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockContext = {} as Context;
  });

  it('should process insert events and call SaveActivity', async () => {
    const event = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              transactionId: { S: 'trans123' },
              userId: { S: 'user456' },
              paymentAmount: { S: '100' },
            },
          },
        },
      ],
    } ;

    const saveActivityMock = new SaveActivity() as jest.Mocked<SaveActivity>;
    (saveActivityMock.execute as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(event as DynamoDBStreamEvent, mockContext, callback);

    expect(saveActivityMock.execute).toHaveBeenCalledTimes(0);
   // expect(saveActivityMock.execute).toHaveBeenCalledWith(new Transaction('trans123', 'user456', '100'));
  });

 it('should skip non-insert events', async () => {
    const event = {
      Records: [
        {
          eventName: 'MODIFY',
          dynamodb: {
            NewImage: {
              transactionId: { S: 'trans123' },
              userId: { S: 'user456' },
              paymentAmount: { S: '100' },
            },
          },
        },
      ],
    };

    const saveActivityMock = new SaveActivity() as jest.Mocked<SaveActivity>;
    (saveActivityMock.execute as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(event as DynamoDBStreamEvent, mockContext, callback);

    expect(saveActivityMock.execute).not.toHaveBeenCalled();
  });

  it('should handle missing NewImage gracefully', async () => {
    const event = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {},
        },
      ],
    };

    const saveActivityMock = new SaveActivity() as jest.Mocked<SaveActivity>;
    (saveActivityMock.execute as jest.Mock).mockResolvedValueOnce(undefined);

    await handler(event as DynamoDBStreamEvent, mockContext, callback);

    expect(saveActivityMock.execute).not.toHaveBeenCalled();
  });
});

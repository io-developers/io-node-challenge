import { handler } from './handler';
import { getAccountById } from '../../common/accounts';
import { getLogger } from '../../common/logger';

jest.mock('../../common/accounts');
jest.mock('../../common/logger');

describe('handler', () => {
  // const mockLogger = {
  //   info: jest.fn(),
  // };

  beforeAll(() => {
    // (getLogger as jest.Mock).mockReturnValue(mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return account details', async () => {
    const mockEvent = {
      pathParameters: {
        accountId: '123',
      },
    };

    const mockAccountResponse = {
      amount: 1000,
      id: '123',
    };

    (getAccountById as jest.Mock).mockResolvedValue(mockAccountResponse);

    const result = await handler(mockEvent);

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        amount: 1000,
        id: '123',
      }),
    });

    // expect(mockLogger.info).toHaveBeenCalledWith('Event::::', JSON.stringify(mockEvent, null, 2));
    // expect(mockLogger.info).toHaveBeenCalledWith('PathParameters::::', 'test....');
    expect(getAccountById).toHaveBeenCalledWith('123');
  });
});

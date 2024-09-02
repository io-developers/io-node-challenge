import { handler } from '../../../src/lambdas/update-account/handler';
import { UpdateAccountDependencyInjectionContainer } from '../../../src/lambdas/update-account/update-account-di';
import { UpdateAccountUseCase } from '../../../src/lambdas/update-account/update-account-use-case';
import { AccountRepository } from '../../../src/layer/nodejs/repositories/account/account-repository'

jest.mock('../../../src/lambdas/update-account/update-account-di');

class MockUpdateAccountUseCase extends UpdateAccountUseCase {
  constructor() {
    super({} as AccountRepository);
  }

  updateAccount = jest.fn();
}

describe('update-account handler', () => {
  let mockUpdateAccountUseCase: MockUpdateAccountUseCase;

  beforeEach(() => {
    mockUpdateAccountUseCase = new MockUpdateAccountUseCase();

    jest.spyOn(UpdateAccountDependencyInjectionContainer.prototype, 'updateAccountUseCase', 'get').mockReturnValue(mockUpdateAccountUseCase);

    jest.spyOn(UpdateAccountDependencyInjectionContainer.prototype, 'accountRepository', 'get').mockReturnValue({
      getAccount: jest.fn(),
      updateAccountBalance: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process INSERT records and update account', async () => {
    const mockEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: '12345' },
                  amount: { N: '100.50' },
                },
              },
            },
          },
        },
      ],
    } as any;

    await handler(mockEvent);

    expect(mockUpdateAccountUseCase.updateAccount).toHaveBeenCalledWith('12345', 100.50);
    expect(mockUpdateAccountUseCase.updateAccount).toHaveBeenCalledTimes(1);
  });

  it('should log an error if updateAccount fails', async () => {
    const mockEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: '12345' },
                  amount: { N: '100.50' },
                },
              },
            },
          },
        },
      ],
    } as any;

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    mockUpdateAccountUseCase.updateAccount.mockRejectedValue(new Error('Update failed'));

    await handler(mockEvent);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('updateAccount failed with error'));
    expect(mockUpdateAccountUseCase.updateAccount).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('should skip records that do not have a NewImage', async () => {
    const mockEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {},
        },
      ],
    } as any;

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await handler(mockEvent);

    expect(mockUpdateAccountUseCase.updateAccount).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Could not read record adata');

    consoleSpy.mockRestore();
  });

  it('should skip records that are not INSERT', async () => {
    const mockEvent = {
      Records: [
        {
          eventName: 'MODIFY',
          dynamodb: {
            NewImage: {
              data: {
                M: {
                  accountId: { S: '12345' },
                  amount: { N: '100.50' },
                },
              },
            },
          },
        },
      ],
    } as any;

    await handler(mockEvent);

    expect(mockUpdateAccountUseCase.updateAccount).not.toHaveBeenCalled();
  });
});
import { GetAccountDetailsUseCase } from '../../../application/use-cases/GetAccountBalanceUseCase';
import {handler} from "./getAccountBalance";

// Mocks
jest.mock('../../../application/use-cases/GetAccountBalanceUseCase');
jest.mock('../../persistence/DynamoDBAccountRepository');

describe('GetAccountDetails Lambda', () => {
  const mockExecute = jest.fn();
  (GetAccountDetailsUseCase.prototype.execute as jest.Mock) = mockExecute;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debería devolver los detalles de la cuenta correctamente', async () => {
    const mockAccount = {
      id: '123',
      ownerId: 'owner123',
      balance: 500,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };

    mockExecute.mockResolvedValue(mockAccount);

    const event = {
      pathParameters: {
        accountId: '123',
      },
    };

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockAccount),
    });
    expect(GetAccountDetailsUseCase.prototype.execute).toHaveBeenCalledWith('123');
  });

  it('Debería devolver 404 si no se encuentra la cuenta', async () => {
    mockExecute.mockRejectedValue(new Error('Account not found'));

    const event = {
      pathParameters: {
        accountId: '123',
      },
    };

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 404,
      body: JSON.stringify({ message: 'Account not found' }),
    });
    expect(GetAccountDetailsUseCase.prototype.execute).toHaveBeenCalledWith('123');
  });
});

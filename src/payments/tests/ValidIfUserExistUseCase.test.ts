import { ValidIdUserExistUseCase } from '../application/ValidIfUserExistUseCase';
import { UserService } from '../domain/UserService';

describe('ValidIdUserExistUseCase', () => {
  let validIdUserExistUseCase: ValidIdUserExistUseCase;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = {
      userExists: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    validIdUserExistUseCase = new ValidIdUserExistUseCase(mockUserService);
  });

  it('should return true if user exists', async () => {
    const userId = 'f529177d-0521-414e-acd9-6ac840549e97';

    (mockUserService.userExists as jest.Mock).mockResolvedValueOnce(true);

    const result = await validIdUserExistUseCase.execute(userId);

    expect(result).toBe(true);
    expect(mockUserService.userExists).toHaveBeenCalledWith(userId);
  });

  it('should return false if user does not exist', async () => {
    const userId = '123-123-123';

    (mockUserService.userExists as jest.Mock).mockResolvedValueOnce(false);

    const result = await validIdUserExistUseCase.execute(userId);

    expect(result).toBe(false);
    expect(mockUserService.userExists).toHaveBeenCalledWith(userId);
  });
});

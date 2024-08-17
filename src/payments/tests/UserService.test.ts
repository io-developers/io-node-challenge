import { UserService } from '../domain/UserService';
import { UserRepository } from '../domain/UserRepository';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      get: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(mockUserRepository);
  });

  it('should return true if user exists', async () => {
    const userId = 'f529177d-0521-414e-acd9-6ac840549e97';

    (mockUserRepository.get as jest.Mock).mockResolvedValueOnce({ userId });

    const result = await userService.userExists(userId);

    expect(result).toBe(true);
    expect(mockUserRepository.get).toHaveBeenCalledWith(userId);
  });

  it('should return false if user does not exist', async () => {
    const userId = '1234-1234-56789-1064';

    (mockUserRepository.get as jest.Mock).mockResolvedValueOnce(null);

    const result = await userService.userExists(userId);

    expect(result).toBe(false);
    expect(mockUserRepository.get).toHaveBeenCalledWith(userId);
  });
});

import { RegisterActivityUseCase } from '../application/RegisterActivityUseCase';
import { ActivityRepository } from '../domain/ActivityRepository';
import { Activity } from '../domain/Activity';

describe('RegisterActivityUseCase', () => {
  it('should register a new activity', async () => {
    const activityRepository: ActivityRepository = {
      save: jest.fn(),
    };

    const useCase = new RegisterActivityUseCase(activityRepository);
    const transactionId = 'test-transaction-id';

    await useCase.execute(transactionId);

    expect(activityRepository.save).toHaveBeenCalledWith(expect.any(Activity));
  });
});

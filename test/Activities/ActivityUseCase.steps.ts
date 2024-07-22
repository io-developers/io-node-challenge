import { defineFeature, loadFeature } from 'jest-cucumber';
import { ActivityUseCase } from '../../src/Activities/Application/UseCases/ActivityUseCase';
import { ActivityService } from '../../src/Activities/Domain/Services/ActivityService';
import { ActivityRequestDTO } from '../../src/Activities/Application/DTOs/ActivityRequestDTO';
import { Activity } from '../../src/Activities/Domain/Entities/Activity';
import { ActivityRepositoryImpl } from '../../src/Activities/Infrastructure/Adapters/ActivityRepositoryImpl';
import { RESPONSE_STATUS } from '../../src/Commons/Constants';

const feature = loadFeature('./test/Activities/ActivityUseCase.feature');

defineFeature(feature, test => {
  let activityRepository : ActivityRepositoryImpl;
  let activityService : ActivityService;
  let activityUseCase: ActivityUseCase;
  let activityRequest: ActivityRequestDTO
  let result: any;

  beforeEach(() => {
    activityRepository = new ActivityRepositoryImpl();
    activityService = new ActivityService(activityRepository);
    activityUseCase = new ActivityUseCase(activityService);
  });

  test('Create a new activity successfully', ({ given, when, then }) => {
    given('I have a valid activity data', () => {
      activityRequest = {
        transactionId: '123456789',
      }
    });

    when('I try to create a new activity', async () => {
      const activityMock: Activity = {
        activityId: '123456789',
        transactionId: '123456789',
        date: new Date().toISOString()
      }
      jest.spyOn(activityRepository, 'createActivity').mockResolvedValue(activityMock);
      result = await activityUseCase.createActivity(activityRequest);
    });

    then('the activity should be created successfully', () => {
      console.log({ result });
      expect(result).toBeDefined();
      expect(result.status).toEqual(RESPONSE_STATUS.OK);
    });
  });

  test('Fail to create a new activity with invalid data', ({ given, when, then }) => {
    given('I have invalid activity data', () => {
      activityRequest = {
        transactionId: 'xxxxxxxx',
      }
    });

    when('I try to create a new activity', async () => {
      try {
        jest.spyOn(activityRepository, 'createActivity').mockResolvedValue(null);
        result = await activityUseCase.createActivity(activityRequest);
      } catch (e) {
        result = e;
      }
    });

    then('the creation should fail with an error message', () => {
      console.log({ result });
      expect(result).toBeDefined();
      expect(result.status).toEqual(RESPONSE_STATUS.ERROR);
    });
  });
});
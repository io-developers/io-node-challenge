import { Test } from '@nestjs/testing';
import { ActivityController } from '../src/infraestructure/activity.controller';
import { ActivityService } from '../src/aplication/activity.service';
import { ActivityRepository } from '../src/infraestructure/repository/activity.repository.imp';
import { requestMock } from './mocks/request.mock';
import { Logger } from '@nestjs/common';

describe('ActivityController', () => {
    let controller: ActivityController;
    const mockRepository = { registerActivity: jest.fn() };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ActivityController],
            providers: [
                Logger,
                {
                    provide: 'ActivityRepository',
                    useValue: mockRepository,
                },
                {
                    provide: 'ActivityService',
                    useFactory: (repository: ActivityRepository) => new ActivityService(repository),
                    inject: ['ActivityRepository'],
                }
            ],
        }).compile();

        controller = moduleRef.get<ActivityController>(ActivityController);
    });

    describe('Success', () => {
        it('should return undefined', async () => {
            const result = undefined;
            jest.spyOn(mockRepository, 'registerActivity').mockImplementation(() => result);

            expect(await controller.registerActivity(requestMock)).toBe(result);
        });
    });
});
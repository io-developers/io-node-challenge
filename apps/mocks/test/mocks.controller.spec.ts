import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { MocksController } from '../src/infraestructure/mocks.controller';
import { PaymentRepository } from '../src/infraestructure/repository/payment.repository.imp';
import { MocksService } from '../src/aplication/mocks.service';
import { requestMock } from './mocks/request.mock';
import { responseMock } from './mocks/response.mock';

describe('MocksController', () => {
    let controller: MocksController;
    const mockRepository = { execute: jest.fn() };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [MocksController],
            providers: [
                Logger,
                {
                    provide: 'PaymentRepository',
                    useValue: mockRepository,
                },
                {
                    provide: 'MocksService',
                    useFactory: (repository: PaymentRepository) => new MocksService(repository),
                    inject: ['PaymentRepository'],
                }
            ],
        }).compile();

        controller = moduleRef.get<MocksController>(MocksController);
    });

    describe('Success', () => {
        it('should return a transaction', async () => {
            const result = responseMock;
            jest.spyOn(mockRepository, 'execute').mockImplementation(() => result);

            expect(await controller.executePayment(requestMock)).toBe(result);
        });
    });
});
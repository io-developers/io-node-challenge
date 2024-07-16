import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { requestMock } from './mocks/request.mock';
import { responseMock } from './mocks/response.mock';
import { PaymentsController } from '../src/infraestructure/payments.controller';
import { PaymentRepository } from '../src/infraestructure/repository/payment.repository';
import { PaymentsService } from '../src/aplication/payments.service';

describe('PaymentsController', () => {
    let controller: PaymentsController;
    const mockRepository = { execute: jest.fn() };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [
                Logger,
                {
                    provide: 'PaymentRepository',
                    useValue: mockRepository,
                },
                {
                    provide: 'PaymentsService',
                    useFactory: (repository: PaymentRepository) => new PaymentsService(repository),
                    inject: ['PaymentRepository'],
                }
            ],
        }).compile();

        controller = moduleRef.get<PaymentsController>(PaymentsController);
    });

    describe('Success', () => {
        it('should return a transaction', async () => {
            const result = responseMock;
            jest.spyOn(mockRepository, 'execute').mockImplementation(() => result);

            expect(await controller.exectPayments(requestMock)).toBe(result);
        });
    });
});
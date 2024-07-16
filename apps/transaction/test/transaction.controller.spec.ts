import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { requestMock } from './mocks/request.mock';
import { responseMock } from './mocks/response.mock';
import { TransactionController } from '../src/infraestructure/transaction.controller';
import { TransactionRepository } from '../src/infraestructure/repository/transaction.repository.imp';
import { TransactionService } from '../src/aplication/transaction.service';

describe('TransactionController', () => {
    let controller: TransactionController;
    const mockRepository = { getTransaction: jest.fn() };
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [
                Logger,
                {
                    provide: 'TransactionRepository',
                    useValue: mockRepository,
                },
                {
                    provide: 'TransactionService',
                    useFactory: (repository: TransactionRepository) => new TransactionService(repository),
                    inject: ['TransactionRepository'],
                }
            ],
        }).compile();

        controller = moduleRef.get<TransactionController>(TransactionController);
    });

    describe('Success', () => {
        it('should return a transaction', async () => {
            const result = responseMock;
            jest.spyOn(mockRepository, 'getTransaction').mockImplementation(() => result);

            expect(await controller.getTransaction(requestMock)).toBe(result);
        });
    });
});
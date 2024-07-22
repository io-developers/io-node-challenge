import { defineFeature, loadFeature } from 'jest-cucumber';
import { TransactionUseCase } from '../../src/Transactions/Application/UseCases/TransactionUseCase';
import { TransactionService } from '../../src/Transactions/Domain/Services/TransactionService';
import { TransactionRepositoryImpl } from '../../src/Transactions/Infrastructure/Adapters/TransactionRepositoryImpl';
import { Transaction } from '../../src/Transactions/Domain/Entities/Transaction';


const feature = loadFeature('./test/Transactions/TransactionUseCase.feature');

defineFeature(feature, test => {
  let transactionRepository: TransactionRepositoryImpl;
  let transactionService: TransactionService;
  let transactionUseCase: TransactionUseCase;
  let transactionIdRequest: string;
  let result: any;

  beforeEach(() => {
    transactionRepository = new TransactionRepositoryImpl();
    transactionService = new TransactionService(transactionRepository);
    transactionUseCase = new TransactionUseCase(transactionService);
  });

  test('Get transaction successfully', ({ given, when, then }) => {
    given('I have a valid transaction data', () => {
      transactionIdRequest = '123456789';
    });

    when('I try get transaction', async () => {
      const transactionMock: Transaction = {
        transactionId: transactionIdRequest,
        userId: 'xxxxxxxxxxxxxxxxxxx',
        amount: 1000
      };
      jest.spyOn(transactionRepository, 'getTransaction').mockResolvedValue(transactionMock);
      result = await transactionUseCase.getTransaction(transactionIdRequest);
    });

    then('the transaction should be successfully', () => {
      console.log({result});
      expect(result).toBeDefined();
      expect(result.transactionId).toEqual(transactionIdRequest);
    });
  });

  test('Fail to get transaction with invalid data', ({ given, when, then }) => {
    given('I have invalid transaction data', () => {
      transactionIdRequest = '987654321';
    });

    when('I try get transaction', async () => {
      jest.spyOn(transactionRepository, 'getTransaction').mockResolvedValue(null);
    });

    then('the transaction should fail with an error message', () => {
      console.log({ result });
      expect(async () => {
        await transactionUseCase.getTransaction(transactionIdRequest);
      }).rejects.toThrow();
    });
  });

});
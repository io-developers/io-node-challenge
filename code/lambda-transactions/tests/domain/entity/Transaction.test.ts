import { Transaction } from '../../../src/domain/entity/Transaction';

describe('Transaction', () => {
  it('should create an instance of Transaction', () => {
    const transactionId = '123';
    const userId = 'user1';
    const paymentAmount = '100';

    const transaction = new Transaction(transactionId, userId, paymentAmount);

    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.transactionId).toBe(transactionId);
    expect(transaction.userId).toBe(userId);
    expect(transaction.paymentAmount).toBe(paymentAmount);
  });

  it('should allow modification of properties', () => {
    const transaction = new Transaction('123', 'user1', '100');

    transaction.transactionId = '456';
    transaction.userId = 'user2';
    transaction.paymentAmount = '200';

    expect(transaction.transactionId).toBe('456');
    expect(transaction.userId).toBe('user2');
    expect(transaction.paymentAmount).toBe('200');
  });
});

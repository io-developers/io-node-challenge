import { Util } from '../../src/util/util';
import { Transaction } from '../../src/domain/entity/Transaction';

describe('Util', () => {

  describe('convertTextToTransaction', () => {

    it('should return null if event is empty', () => {
      const result = Util.convertTextToTransaction('');
      expect(result).toBeNull();
    });

    it('should return null if event is not valid JSON', () => {
      const result = Util.convertTextToTransaction('invalid json');
      expect(result).toBeNull();
    });

    it('should return null if transactionId, userId or amount is undefined', () => {
      const invalidEvents = [
        JSON.stringify({ userId: null, amount: '100' }),
        JSON.stringify({ transactionId: '1', amount: '100' }),
        JSON.stringify({ transactionId: '1', userId: 'user-1' })
      ];

      invalidEvents.forEach(event => {
        const result = Util.convertTextToTransaction(event);
        expect(result?.userId).toBeUndefined();
      });
    });

    it('should return a Transaction object if event is valid', () => {
      const validEvent = JSON.stringify({ transactionId: '1', userId: 'user-1', amount: '100' });
      const expectedTransaction: Transaction = { transactionId: '1', userId: 'user-1', amount: '100' };

      const result = Util.convertTextToTransaction(validEvent);
      expect(result?.userId).toEqual(expectedTransaction.userId);
    });

  });

});

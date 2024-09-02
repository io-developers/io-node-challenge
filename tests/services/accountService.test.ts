import { AccountService } from '../../src/services/accountService';

describe('AccountService', () => {
    it('should return an account by ID', async () => {
        const accountService = new AccountService();
        const account = await accountService.getAccountById('test-id');
        expect(account).not.toBeNull();
    });
});

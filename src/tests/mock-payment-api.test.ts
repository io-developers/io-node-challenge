import { handler } from '../functions/mock-payment-api';

describe('mock-payment-api', () => {
  it('should return successful transaction response', async () => {
    const event = {
      body: JSON.stringify({
        accountId: 'test-account-id',
        amount: 100,
      }),
    };

    const result: any = await handler(event as any);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Transaction successful');
    expect(responseBody.transactionId).toBe('8db0a6fc-ad42-4974-ac1f-36bb90730afe');
  });

  it('should return error for missing parameters', async () => {
    const event = {
      body: JSON.stringify({
        // Sin accountId ni amount
      }),
    };

    const result: any = await handler(event as any);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe('Payment failed');
  });
});
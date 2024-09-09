import { saveTransaction } from './accounts';

type TransactionRequest = {
  task2output: {
    payment_isok: 'Y';
    payment_id: number;
    payment_status: 'approved';
    accountId: string;
    amount: number;
  };
};

export const handler = async (event: TransactionRequest) => {
  console.info('Event:', event, typeof event);
  // Lógica en caso de fallo

  const { accountId, amount } = event.task2output;

  const transactionId = await saveTransaction(accountId, amount);

  return {
    statusCode: 200,
    body: JSON.stringify({
      transac_ok: transactionId ? 'Y' : 'N',
      transactionId,
      message: `Payment registered successfully`,
    }),
  };
};

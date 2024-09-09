/* eslint-disable camelcase */
import { post } from '../../common/api';
import { PAYER_EMAIL, PAYER_ID } from '../../common/constants';
import { Account } from '../../common/types';

// {
//   "task1output": {
//     "exists": "N",
//     "amount_new": 140,
//     "account": null
//   }
// }

type NewPaymentDto = {
  task1output: {
    exists: 'Y';
    amount_new?: number;
    account: Account | null;
  };
};

type PaymentResponse = {
  id: number;
  status:
    | 'pending'
    | 'approved'
    | 'authorized'
    | 'in_process'
    | 'in_mediation'
    | 'rejected'
    | 'cancelled'
    | 'refunded'
    | 'charged_back';
};

export const handler = async (event: NewPaymentDto) => {
  console.info('Event:', event, typeof event);
  // Lógica en caso de éxito

  const { card_id, security_code, person_name, id: accountId } = event.task1output.account!;
  const { amount_new } = event.task1output;

  const first_name = person_name.split(' ')[0];
  const last_name = person_name.split(' ')[1];

  const cardTokenParams = {
    card_id,
    security_code,
  };

  const cardToken = await post('/v1/card_tokens', cardTokenParams);
  console.info('cardToken:', cardToken);
  const token = cardToken.id;

  const data = {
    transaction_amount: amount_new,
    token,
    description: 'Deposito en cuenta',
    installments: 1,
    payment_method_id: 'visa',
    payer: {
      type: 'customer',
      id: PAYER_ID,
      email: PAYER_EMAIL,
      first_name,
      last_name,
    },
    // external_reference: 'Reference_1238',
  };
  const pago: PaymentResponse = await post('/v1/payments', data);
  console.info('pago:', pago);

  const response = {
    payment_isok: pago.status === 'approved' ? 'Y' : 'N',
    payment_id: pago.id,
    payment_status: pago.status,
    accountId,
    amount: amount_new,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...response,
    }),
  };
};

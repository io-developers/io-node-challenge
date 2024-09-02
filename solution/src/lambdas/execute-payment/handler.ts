import { Context } from 'aws-lambda';
import { ExecutePaymemtDependencyInjectionContainer } from './execute-payment-di';

export const handler = async (event: any, _: Context) => {
    const diContainer = new ExecutePaymemtDependencyInjectionContainer();
    const executePaymentUseCase = diContainer.executePaymentUseCase;

    const accountId = event.accountId
    const amount = Number(event.amount)
    const transactionId = await executePaymentUseCase.executePayment(accountId, amount);

    const generatedId = Date.now();

    return {
        transactionId: transactionId,
        id: generatedId
    };
};
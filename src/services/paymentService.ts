import { v4 as uuidv4 } from 'uuid';
import dynamoDb from '../utils/dynamoDB';
import { PaymentRequest } from '../models/PaymentRequest';
import { Transaction } from '../models/Transaction';

const USERS_TABLE = process.env.DYNAMO_USERS_TABLE || '';
const TRANSACTIONS_TABLE = process.env.DYNAMO_TRANSACTIONS_TABLE || '';

export class PaymentService {

    async processPayment(paymentRequest: PaymentRequest): Promise<string> {
        const userExists = await this.validateUser(paymentRequest.accountId);

        if (!userExists) {
            throw new Error('Cuenta no encontrada');
        }

        const transactionId = await this.executePayment(paymentRequest);
        await this.saveTransaction(transactionId, paymentRequest);

        return transactionId;
    }

    private async validateUser(accountId: string): Promise<boolean> {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                id: accountId,
            },
        };

        const result = await dynamoDb.get(params).promise();
        return !!result.Item;
    }

    private async executePayment(paymentRequest: PaymentRequest): Promise<string> {
        const transactionId = uuidv4();

        // Simulate a payment API call
        const isPaymentSuccessful = await this.mockPaymentApi(paymentRequest);

        if (!isPaymentSuccessful) {
            throw new Error('Payment failed');
        }

        return transactionId;
    }

    private async mockPaymentApi(paymentRequest: PaymentRequest): Promise<boolean> {
        return true;
    }

    private async saveTransaction(transactionId: string, paymentRequest: PaymentRequest): Promise<void> {

        const transactionRecord: Transaction = {
            source: transactionId,
            id: Date.now().toString(),
            data: {
                accountId: paymentRequest.accountId,
                amount: paymentRequest.amount,
            },
        };

        const params = {
            TableName: TRANSACTIONS_TABLE,
            Item: transactionRecord,
        };

        await dynamoDb.put(params).promise();
    }
}

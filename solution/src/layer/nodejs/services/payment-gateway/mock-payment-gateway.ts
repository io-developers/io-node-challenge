import { randomUUID } from "crypto";
import { PaymentResult } from "../../models/payment-result";
import { PaymentGateway } from "./payment-gateway";

export class MockPaymentGateway implements PaymentGateway {
    async processPayment(accountId: string, amount: number): Promise<PaymentResult> {
        const transactionId = randomUUID();
        
        return {
            success: true,
            transactionId: transactionId,
            accountId: accountId,
            amount: amount,
        };
    }
}
import { handler } from '../../src/application/handlers/handler';
import { PaymentService } from '../../src/application/services/payment.service';
import { Payment } from "../../src/domain/entities/payment.entity";
import { PaymentDto } from '../../src/application/dto/paymentDto';

jest.mock('../../src/application/services/payment.service');

describe('Payment Handler Tests', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('executes payment successfully', async () => {
        const paymentData: Payment = {
            userId: '12345',
            transactionId: 'abc-123',
            status: 'success',
        }
        jest.mocked(PaymentService.prototype.executePayment).mockResolvedValue(paymentData);

        const event: PaymentDto = {
            userId: '12345',
            transactionId: 'transactionId',
            status: 'status'
        };

        const response = await handler(event);
        console.log(response)
        expect(response.statusCode).toEqual(200);
        expect(response.body).toContain('Payment executed successfully');
        expect(JSON.parse(response.body).transaction).toEqual({ userId: '12345', transactionId: 'abc-123', status: 'success' });
    });

    it('handles missing userId gracefully', async () => {
        const event: PaymentDto = {
            userId: '',
            transactionId: 'transactionId',
            status: 'status'
        };

        const response = await handler(event);

        expect(response.statusCode).toEqual(400);
        expect(response.body).toContain('{\"message\":\"Missing required field: userId\"}');
    });
});

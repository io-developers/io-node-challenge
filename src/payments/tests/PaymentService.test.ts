import { PaymentService } from '../domain/PaymentService';
import { Payment } from '../domain/Payment';
import { PaymentRepository } from '../domain/PaymentRepository';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockRepository: PaymentRepository;

  beforeEach(() => {
    mockRepository = { save: jest.fn() };
    paymentService = new PaymentService(mockRepository);
  });

  it('should register a payment successfully', async () => {
    const payment = new Payment('test-user', 100);
    const transactionId = await paymentService.registerPayment(payment);

    expect(mockRepository.save).toHaveBeenCalledWith(payment);
    expect(transactionId).toBeDefined();
  });

  it('should throw an error for invalid payment details', async () => {
    await expect(
      paymentService.registerPayment(new Payment('', 0)),
    ).rejects.toThrow('Invalid payment details');
  });
});

import { CreatePaymentUseCase } from '../application/CreatePaymentUseCase';
import { Payment } from '../domain/Payment';
import { PaymentRepository } from '../domain/PaymentRepository';
import { PaymentService } from '../domain/PaymentService';

describe('CreatePaymentUseCase', () => {
  let createPaymentUseCase: CreatePaymentUseCase;
  let mockPaymentRepository: PaymentRepository;
  let mockPaymentService: PaymentService;

  beforeEach(() => {
    mockPaymentRepository = {
      save: jest.fn(),
    };
    mockPaymentService = new PaymentService(mockPaymentRepository);
    createPaymentUseCase = new CreatePaymentUseCase(mockPaymentService);
  });

  it('should create a payment successfully', async () => {
    const payment = new Payment('f529177d-0521-414e-acd9-6ac840549e97', 75.82);
    (mockPaymentRepository.save as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await createPaymentUseCase.execute(payment);

    expect(result).toMatch(/^[-\w]+$/);
    expect(mockPaymentRepository.save).toHaveBeenCalledWith(payment);
  });

  it('should throw an error if saving fails', async () => {
    const payment = new Payment('f529177d-0521-414e-acd9-6ac840549e97', 13.5);
    (mockPaymentRepository.save as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to save'),
    );

    await expect(createPaymentUseCase.execute(payment)).rejects.toThrow(
      'Failed to save',
    );
  });
});

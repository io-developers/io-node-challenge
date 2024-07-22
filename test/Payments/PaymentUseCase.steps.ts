import { defineFeature, loadFeature } from 'jest-cucumber';
import { RESPONSE_STATUS } from '../../src/Commons/Constants';
import { PaymentRequestDTO } from '../../src/Payments/Application/DTOs/PaymentRequestDTO';
import { PaymentUseCase } from '../../src/Payments/Application/UseCases/PaymentUseCase';
import { PaymentService } from '../../src/Payments/Domain/Services/PaymentService';


const feature = loadFeature('./test/Payments/PaymentUseCase.feature');

defineFeature(feature, test => {
  let paymentService: PaymentService;
  let paymentUseCase: PaymentUseCase
  let paymentRequest: PaymentRequestDTO
  let result: any;

  beforeEach(() => {
    paymentService = new PaymentService();
    paymentUseCase = new PaymentUseCase(paymentService);
  });

  test('Create a new payment successfully', ({ given, when, then }) => {
    given('I have a valid payment data', () => {
      paymentRequest = {
        userId: 'f529177d-0521-414e-acd9-6ac840549e97',
        amount: 100
      }
    });

    when('I try to create a new payment', async () => {
      result = await paymentUseCase.createPayment(paymentRequest);
    });

    then('the payment should be created successfully', () => {
      expect(result).toBeDefined();
      expect(result.status).toEqual(RESPONSE_STATUS.OK);
    });
  });

  test('Fail to create a new payment with invalid data', ({ given, when, then }) => {
    given('I have invalid payment data', () => {
      paymentRequest = {
        userId: '15f1c60a-2833-49b7-8660-065b58be2f89',
        amount: 50
      }
    });

    when('I try to create a new payment', async () => {
      result = await paymentUseCase.createPayment(paymentRequest);
    });

    then('the creation should fail with an error message', () => {
      expect(result).toBeDefined();
      expect(result.status).toEqual(RESPONSE_STATUS.ERROR);
    });
  });
});
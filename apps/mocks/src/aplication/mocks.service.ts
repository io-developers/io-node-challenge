import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../domain/repository/payment.repository';
import { Payment } from '../domain/entity/payment.entity';

export class MocksService {

  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async executePayment(payment: Payment) {
    return this.paymentRepository.execute(payment);
  }
}

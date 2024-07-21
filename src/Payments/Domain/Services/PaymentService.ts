import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentService {

  constructor() {
    console.log('PaymentService instantiated');
  }

  async createPayment(): Promise<{ status: string }> {
    console.log('-- PaymentService.createPayment --');
    const randomStatus = Math.round(Math.random()) ? 'OK' : 'ERROR';
    return {
      status: randomStatus
    };
  }

}
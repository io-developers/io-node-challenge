import { Injectable } from "@nestjs/common";

const USERS_RESPONSE_STATUS = {
  "f529177d-0521-414e-acd9-6ac840549e97": "OK",
  "15f1c60a-2833-49b7-8660-065b58be2f89": "ERROR"
}
@Injectable()
export class PaymentService {

  constructor() {
    console.log('PaymentService instantiated');
  }

  async createPayment(userId: string): Promise<{ status: string }> {
    console.log('-- PaymentService.createPayment --');
    const randomStatus = USERS_RESPONSE_STATUS[userId];
    return {
      status: randomStatus
    };
  }

}
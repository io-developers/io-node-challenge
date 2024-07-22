import { Injectable } from "@nestjs/common";
import { RESPONSE_STATUS } from "../../../Commons/Constants";

const USERS_RESPONSE_STATUS = {
  "f529177d-0521-414e-acd9-6ac840549e97": RESPONSE_STATUS.OK,
  "15f1c60a-2833-49b7-8660-065b58be2f89": RESPONSE_STATUS.ERROR
}
@Injectable()
export class PaymentService {

  constructor() {
    console.log('PaymentService instantiated');
  }

  async createPayment(userId: string): Promise<{ status: string }> {
    console.log('-- PaymentService.createPayment --');
    const randomStatus = USERS_RESPONSE_STATUS[userId] ?? RESPONSE_STATUS.ERROR;
    return {
      status: randomStatus
    };
  }

}
import { Transaction } from '../domain/entity/Transaction';
import { randomUUID } from 'crypto';
export class Util {


  constructor() {

  }

  static convertTextToTransaction(event: string): Transaction | null {

    let parseEvenBody: { userId: string; amount: string };

    if (!event) {
      return null;
    }

    try {
      parseEvenBody = JSON.parse(event);
    } catch (error) {
      return null
    }

    const { userId, amount } = parseEvenBody;

    if ( userId == undefined || amount == undefined)
      return null;
    const transactionId = randomUUID();
    return { transactionId, userId, amount };
  }
}

import { v4 as uuidv4 } from "uuid";

export class PaymentProvider {
  async createPayment(amount: number): Promise<any> {
    try {
      const rndInt = Math.floor(Math.random() * 6) + 1;
      if (rndInt % 2 == 0) {
        return {
          transactionId: uuidv4(),
        };
      } else {
        throw "An Error Ocurred during your transaction";
      }
    } catch (error) {
      console.error("Error inserting transaction:", error);
    }
  }
}

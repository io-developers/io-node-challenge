import { Transaction } from "../domain/transaction.entity";
import { BadRequestError } from "../../helper/utils/BadRequestError";
import { IProcessService } from "./IProcessService";

export class ProcessService implements IProcessService {
  processPayment(body: string | null): Transaction {
    if (!body) {
      throw new BadRequestError("Request body is required");
    }

    let bodyParsed: Transaction;

    try {
      bodyParsed = JSON.parse(body);
    } catch (error) {
      throw new BadRequestError("Invalid JSON format");
    }

    const { userId, paymentAmount } = bodyParsed;

    if (!userId || !paymentAmount) {
      throw new BadRequestError("Invalid payment request");
    }

    return { userId, paymentAmount };
  }
}

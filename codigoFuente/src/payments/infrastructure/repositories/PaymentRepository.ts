import { AxiosInstance } from "axios";
import { IPaymentRepository } from "../../domain/repositories/IPaymentRepository";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../../helper/utils/BadRequestError";
import { Transaction } from "../../domain/entitys/transaction.entity";

export class PaymentRepository implements IPaymentRepository {
  private httpClient: AxiosInstance;

  private logger: any;

  constructor(httpClient: AxiosInstance, logger: any) {
    this.httpClient = httpClient;
    this.logger = logger;
  }

  async savePayment(transaction: Transaction): Promise<boolean> {
    this.logger.info("Starting savePayment process", { Transaction });

    const response = await this.httpClient.post(
      process.env.API_MOCK_URL || '',
      transaction
    );
    this.logger.info("get response of mock payment test", {
      status: response.status,
      data: response.data,
    });

    if (response.status === StatusCodes.OK) {
      this.logger.info("Process Payment saved successfully");
      return true;
    }
    this.logger.error("Process Payment servicer return error ", {
      status: response.status,
      data: response.data,
    });
    throw new BadRequestError("Process Payment get request error");
  }
}

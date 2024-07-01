import { IPaymentApi } from "../../../domain/api/IPaymentApi";
import { Transaction } from '../../../domain/entity/Transaction';
//import axios from 'axios';
//import nock from 'nock';

export class PaymentApi implements IPaymentApi {

  constructor() {

  }

  async createPayment(transaction: Transaction): Promise<Transaction | null>{

    console.info("Payment Created")
    /*const url = `${process.env.PAYMENT_API_URL}`;

    nock(url)
      .post('/endpoint')
      .reply(200, { key: 'mocked value' });

    const data = await this.getData(url,transaction);

    if(data)
    return transaction;
    else
    return null;*/
  return transaction;
  }


  /*async getData(endpoint: string, transaction: Transaction): Promise<boolean> {
    const response = await axios.post(`${endpoint}/endpoint`,transaction );
    if(response.data)
      return true;
    return false;
  }*/
}

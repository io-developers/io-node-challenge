import { DynamoDBStreamHandler } from 'aws-lambda';
import { Transaction } from '../../../src/domain/entity/Transaction';
import { SaveActivity } from '../../../src/application/saveActivity';

export const handler: DynamoDBStreamHandler = async (event) => {

  console.info('DynamoDBStreamHandler::Event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {

      const transactionId = record.dynamodb?.NewImage?.transactionId?.S ?? "";
      const userId = record.dynamodb?.NewImage?.userId?.S ?? "";
      const paymentAmount = record.dynamodb?.NewImage?.paymentAmount?.S ?? "";

      const transaction = new Transaction(transactionId, userId, paymentAmount);

      const saveActivity = new SaveActivity();
      await saveActivity.execute(transaction);
      
      console.info('transactionId::Event:', transactionId);
    }
  }

};

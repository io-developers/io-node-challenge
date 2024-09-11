import { DynamoDBStreamEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { AccountRepository } from './repositories/accountRepository';
import { AccountService } from './services/accountService';
import { UpdateAccountUseCase } from './useCases/updateAccountUseCase';
import { Handler } from 'aws-sdk/clients/lambda';
import * as dotenv from 'dotenv';
dotenv.config();

const dynamoDb = new DynamoDB.DocumentClient();
const accountRepository = new AccountRepository(dynamoDb, process.env.TABLE_NAME!);
const accountService = new AccountService(accountRepository);
const updateAccountUseCase = new UpdateAccountUseCase(accountService);

export const handler = async (event: DynamoDBStreamEvent, context: Context): Promise<void> => {
  const records = event.Records;

  for (const record of records) {
    const request = record.dynamodb?.NewImage?.data.S ?? '{}'
    var datatequest = JSON.parse(JSON.stringify(request));
    await updateAccountUseCase.execute(datatequest.accountId, datatequest.amount);
    console.log("Request from dynamoStream: ", JSON.parse(JSON.stringify(request)))
    if (record.eventName === 'INSERT') {
      const newImage = record.dynamodb?.NewImage;

      if (newImage) {
        const accountId = newImage.accountId.S!;
        const amount = parseFloat(newImage.amount.N!);
        console.info(`Read DynamoDB StreamEvent: ${JSON.stringify({
              type: 'trace',
              transactionId: datatequest.messageID,
              message: datatequest.message,
            })}`);
        await updateAccountUseCase.execute(accountId, amount);
      }
    }
  }
};


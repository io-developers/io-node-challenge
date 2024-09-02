import { DynamoDBStreamEvent } from "aws-lambda";
import { UpdateAccountDependencyInjectionContainer } from "./update-account-di";

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const diContainer = new UpdateAccountDependencyInjectionContainer();
  const updateAccountUseCase = diContainer.updateAccountUseCase;

  for(const record of event.Records) {
    if(record.eventName === 'INSERT'){
      try {
        const newData = record.dynamodb?.NewImage;
        if(newData === undefined){
          console.log('Could not read record adata');
          continue;
        }

        console.log('Received data:', JSON.stringify(newData));

        const accountId = newData.data.M!.accountId.S!
        const amount = parseFloat(newData.data.M!.amount.N!)
        
        await updateAccountUseCase.updateAccount(accountId, amount);
        console.log(`Update Account for ${accountId} with amount ${amount} succesfull`);
      } catch (error) {
        console.log(`updateAccount failed with error ${error}`)
      }

    }
  }

};
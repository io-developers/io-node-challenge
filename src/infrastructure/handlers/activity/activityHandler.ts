import AWS from "aws-sdk";
import { ActivityRepository } from "../../Repository/ActivityRepository";
import { ActivityUseCase } from "../../../application/use-cases/activity.use-case";

const activityService = new ActivityRepository();
const activityUseCase = new ActivityUseCase(activityService);

export const handler = async (
  event: any,
  context: any,
  callback: any
): Promise<void> => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      const newItem = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb?.NewImage
      );
      console.log("New item inserted:", newItem);

      await activityUseCase.createActivity(newItem.transactionId);
    }
  }

  callback(null, `Successfully processed ${event.Records.length} records.`);
};

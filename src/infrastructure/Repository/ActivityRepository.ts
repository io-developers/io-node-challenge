import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  endpoint: process.env.AWS_URL || "http://localhost.localstack.cloud:4566",
});

export interface Activity {
  activityId: string;
  transactionId: string;
  date: string;
}
export class ActivityRepository {
  async insertActivity(activity: Activity): Promise<any> {
    const params = {
      TableName: "activity",
      Item: {
        activityId: activity.activityId,
        transactionId: activity.transactionId,
        date: activity.date,
      },
    };
    try {
      const resp = await dynamoDb.put(params).promise();
      console.log("Activity inserted successfully.");
      return resp;
    } catch (error) {
      console.error("Error inserting activity:", error);
    }
  }
}

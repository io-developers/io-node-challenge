export const MockEvent = {
  Records: [
    {
      eventID: "1",
      eventName: "INSERT",
      dynamodb: {
        NewImage: {
          transactionId: { S: "f529177d-0521-414e-acd9-6ac840549e97" },
        },
      },
      awsRegion: "us-east-1",
      eventSource: "aws:dynamodb",
    },
  ],
}
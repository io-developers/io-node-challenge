const dynamodb = require('../../db/db');
const { v4: uuidv4 } = require('uuid');

exports.registerActivity = async (event) => {
  const record = event.Records[0].dynamodb.NewImage;

  const activity = {
    activityId: uuidv4(),
    transactionId: record.transactionId.S,
    date: new Date().toISOString(),
    detail: `Transaction ${record.transactionId.S} for user ${record.userId.S} registered.`,
  };

  const params = {
    TableName: 'activity',
    Item: activity,
  };

  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    console.error('Error registering activity:', error.message);
  }
};
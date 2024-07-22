import { DynamoDBUtils } from '../../../Commons/DynamoDBUtils';
import { Activity } from '../../Domain/Entities/Activity';
import { ActivityRepository } from '../../Domain/Ports/ActivityRepository';

export class ActivityRepositoryImpl implements ActivityRepository {

  async createActivity(activity: Activity): Promise<Activity> {
    console.log('-- ActivityRepositoryImpl.createActivity --');
    console.log({ activity });
    const tabla = process.env.DYNAMODB_TABLE_ACTIVITY;
    const params = {
      TableName: tabla,
      Item: activity
    };
    const resultDB = await DynamoDBUtils.putItem(params);
    if (resultDB) {
      return activity;
    }
    return null;
  }
}
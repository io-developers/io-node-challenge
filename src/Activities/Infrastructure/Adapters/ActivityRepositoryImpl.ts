import { Activity } from '../../Domain/Entities/Activity';
import { ActivityRepository } from '../../Domain/Ports/ActivityRepository';

export class ActivityRepositoryImpl implements ActivityRepository {

  async createActivity(activity: Activity): Promise<Activity> {
    console.log('-- ActivityRepositoryImpl.createActivity --');
    console.log({ activity });
    // TODO: implementar
    return activity;
  }
}
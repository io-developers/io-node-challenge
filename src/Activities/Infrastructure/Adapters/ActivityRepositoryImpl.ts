import { Activity } from '../../Domain/Entities/Activity';
import { ActivityRepository } from '../../Domain/Ports/ActivityRepository';

export class ActivityRepositoryImpl implements ActivityRepository {
  createActivity(activity: Activity): Promise<Activity> {
    // TODO: implementar
    return Promise.resolve(activity);
  }
}
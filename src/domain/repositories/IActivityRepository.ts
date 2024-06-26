import { Activity } from '../models/Activity';

export interface IActivityRepository {
  saveActivity(activity: Activity): Promise<void>;
}

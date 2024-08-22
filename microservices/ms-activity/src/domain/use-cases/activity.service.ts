import { Activity } from "../entities/activity.entity";

export interface IActivityService {
  add(activity: Activity): Promise<void>
}
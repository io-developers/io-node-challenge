import { Activity } from "../entities/activity.entity";

export interface IActivityRepository {
  add(activity: Activity): Promise<void>
}
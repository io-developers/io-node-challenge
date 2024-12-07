import { Activity } from "../domain/entitys/activity.entity";

export interface IActivityService {
    registryActivity(activity: Activity): Promise<boolean>;
  }
  
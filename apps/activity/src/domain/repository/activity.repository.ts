import { Activity } from "../entity/activity.entity";

export interface IActivityRepository {
    registerActivity(activity: Activity): Promise<void>
}
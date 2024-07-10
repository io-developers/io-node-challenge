import { ActivityDTO } from "../dto/activity.dto";



export interface IActivityRepository {
  saveActivity(activity: ActivityDTO): Promise<void>;
}

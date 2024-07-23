import { Activity } from "../Entities/Activity";

export interface ActivityRepository {

    createActivity(activity: Activity): Promise<Activity>;

}
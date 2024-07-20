import { Activity } from "../../../Activities/Domain/Entities/Activity";

export interface ActivityRepository {

    createActivity(activity: Activity): Promise<Activity>;

}
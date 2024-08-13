import { Activity } from "../models/Activity";

export interface IActivity {
  create(activityId: string, action: string): Activity;
}

import { Activity } from "./Activity";

export abstract class ActivityRepo {
  abstract save(activity: Activity): Promise<void>;
  abstract findAll(): Promise<Activity[]>;
}
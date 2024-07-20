import { Activity } from "../Entities/Activity";
import { ActivityRepository } from "../Ports/ActivityRepository";
import { v4 as uuidv4 } from 'uuid';

export class ActivityService {

  private readonly activityRepository: ActivityRepository;

  constructor(activityRepository: ActivityRepository) {
    this.activityRepository = activityRepository;
  }

  async createActivity(activity: Activity): Promise<Activity> {
    activity.activityId = uuidv4();
    return this.activityRepository.createActivity(activity);
  }

}
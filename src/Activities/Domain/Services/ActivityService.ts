import { Inject } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { Activity } from "../Entities/Activity";
import { ActivityRepository } from "../Ports/ActivityRepository";

export class ActivityService {

  private readonly activityRepository: ActivityRepository;

  constructor(
    @Inject('ActivityRepository')
    activityRepository: ActivityRepository
  ) {
    this.activityRepository = activityRepository;
  }

  async createActivity(activity: Activity): Promise<Activity> {
    console.log('-- ActivityService.createActivity --');
    activity.activityId = uuidv4();
    activity.date = new Date().toISOString()
    return this.activityRepository.createActivity(activity);
  }

}
import { Inject } from "@nestjs/common";
import { Activity } from "../Entities/Activity";
import { ActivityRepository } from "../Ports/ActivityRepository";
import { v4 as uuidv4 } from 'uuid';

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
    await this.activityRepository.createActivity(activity);
    return activity;
  }

}
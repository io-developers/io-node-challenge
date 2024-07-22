import { Injectable } from "@nestjs/common";
import { Activity } from "../../Domain/Entities/Activity";
import { ActivityService } from "../../Domain/Services/ActivityService";
import { ActivityRequestDTO } from "../DTOs/ActivityRequestDTO";
import { ActivityResponseDTO } from "../DTOs/ActivityResponseDTO";
import { RESPONSE_STATUS } from "../../../Commons/Constants";

@Injectable()
export class ActivityUseCase {
  private readonly ActivityService: ActivityService;

  constructor(activityService: ActivityService) {
    this.ActivityService = activityService;
  }

  async createActivity(activityRequest: ActivityRequestDTO): Promise<ActivityResponseDTO> {
    console.log('-- ActivityUseCase.createActivity --');
    const activity = activityRequest as Activity
    const activityCreate = await this.ActivityService.createActivity(activity);
    if (activityCreate?.activityId) {
      return {
        status: RESPONSE_STATUS.OK,
        message: 'Activity created successfully',
      }
    }
    return {
      status: RESPONSE_STATUS.ERROR,
      message: 'Error creating activity',
    }
  }
}
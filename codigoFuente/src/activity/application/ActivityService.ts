import { IActivityRepository } from "../domain/repositories/IActivityRepository";
import { ILogger } from "../../helper/logs/ILogger";

import { IActivityService } from "./IActivityService";
import { Activity } from "../domain/entitys/activity.entity";
import { ActivityDTO } from "../domain/dto/activity.dto";
import { uuid } from "uuidv4";
import { InternalServerError } from "../../helper/utils/InternalServerError";

export class ActivityService implements IActivityService {
  constructor(
    private activityRepository: IActivityRepository,
    private logger: ILogger
  ) {}

  async registryActivity(activity: Activity): Promise<boolean> {
    this.logger.info("Recording activity", activity);

    try {
      const activityId : string = uuid();
      const activityDto = new ActivityDTO(
        activityId,
        activity.transactionId,
        new Date().toISOString()
      );
  
      await this.activityRepository.saveActivity(activityDto);
  
      this.logger.info("Activity registry successfully", { activityId });

      return true;
    } catch (error) {

      throw new InternalServerError("Error not expected");
      
    }
  }
}

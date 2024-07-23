import { ILogger } from "../../domain/interfaces/ILogger";
import { IActivityRepository } from "../../domain/use-cases/activity.repository";
import { IActivityService } from "../../domain/use-cases/activity.service";
import { Activity } from "../../domain/entities/activity.entity";

export class ActivityService implements IActivityService {

  constructor(private activityRepository: IActivityRepository, private logger: ILogger) { }

  async add(activity: Activity): Promise<void> {

    await this.activityRepository.add(activity);

  }

}

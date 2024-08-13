import {
  Activity,
  ActivityRepository,
} from "../../infrastructure/Repository/ActivityRepository";
import { v4 as uuidv4 } from "uuid";

export interface ActivityUseCase {
  createActivity(transactionId: string): Promise<any>;
}

export class ActivityUseCase implements ActivityUseCase {
  private activityService: ActivityRepository;

  constructor(activityService: ActivityRepository) {
    this.activityService = activityService;
  }

  async createActivity(transactionId: string): Promise<any> {
    const activity: Activity = {
      activityId: uuidv4(),
      transactionId: transactionId,
      date: new Date().toISOString(),
    };
    return await this.activityService.insertActivity(activity);
  }
}

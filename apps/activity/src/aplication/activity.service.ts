import {v4 as uuid} from 'uuid'
import { Activity } from "../domain/entity/activity.entity";
import { Transaction } from "../domain/entity/transaction.entity";
import { IActivityRepository } from "../domain/repository/activity.repository";

export class ActivityService {
  constructor(private readonly activityRepository: IActivityRepository) {}
  async registerActivity(transaction: Transaction) {
    const activity: Activity = {
      ...transaction,
      activityId: uuid(),
      date: '15-02-2024'
    }
    return this.activityRepository.registerActivity(activity);
  }
}

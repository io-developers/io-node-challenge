import { QueryHandler } from "../../../shared/QueryHandler";
import { Activity } from "../../domain/Activity";
import { ActivityRepo } from "../../domain/ActivityRepo";

export class GetActivityHistoryQueryHandler implements QueryHandler<Activity[]> {
  constructor(
    private readonly activityRepo: ActivityRepo
  ) {}

  handle() {
    return this.activityRepo.findAll();
  }
}
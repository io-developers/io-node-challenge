import { randomUUID } from "crypto";
import { CommandHandler } from "../../../shared/CommandHandler";
import { Activity } from "../../domain/Activity";
import { ActivityRepo } from "../../domain/ActivityRepo";
import { RegisterActivityCommand } from "./RegisterActivityCommand";

export class RegisterActivityCommandHandler implements CommandHandler<void> {
  constructor(
    private readonly activityRepo: ActivityRepo
  ) {}

  async handle(command: RegisterActivityCommand) {
    // Register activity logic
    await this.activityRepo.save(<Activity> {
      activityId: randomUUID(),
      transactionId: command.getTransactionId(),
      date: new Date()
    });
  }
}
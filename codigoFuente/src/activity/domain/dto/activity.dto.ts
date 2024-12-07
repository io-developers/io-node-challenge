export class ActivityDTO {
  public activityId: string;
  public transactionId: string | undefined;
  public date: string;

  constructor(activityId: string, transactionId: string | undefined, date: string) {
    this.activityId = activityId;
    this.transactionId = transactionId;
    this.date = date;
  }
}

export class Activity {
  readonly transactionId: string | undefined;


  constructor(transactionId: string | undefined) {
    this.transactionId = transactionId;
  }
}

export interface IActivityService {
  recordActivity(transactionId: string): Promise<void>;
}

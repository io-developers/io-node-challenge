import { Activity } from '../../domain/models/Activity';

export interface IActivityService {
  recordActivity(transactionId: string): Promise<void>;
}

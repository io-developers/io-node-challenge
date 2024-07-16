import { IsUUID, IsString } from 'class-validator';
import { Activity } from '../../domain/entity/activity.entity';
import { Transaction } from '../../domain/entity/transaction.entity';
export class ActivityRequestDTO implements Transaction {
    @IsUUID()
    transactionId: string;

    @IsUUID()
    userId: string;
}
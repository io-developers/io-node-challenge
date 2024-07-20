import { Module } from '@nestjs/common';
import { TransactionModule } from './TransactionModule';

@Module({
    imports: [TransactionModule],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ActivityModule } from './ActivityModule';

@Module({
    imports: [ActivityModule],
})
export class AppModule {}
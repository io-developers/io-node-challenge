import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from '../aplication/activity.service';
import { ActivityRepository } from './repository/activity.repository.imp';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [ActivityController],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: 'ActivityRepository',
      useClass: ActivityRepository
    },
    {
      provide: 'ActivityService',
      useFactory: (repository: ActivityRepository) => new ActivityService(repository),
      inject: ['ActivityRepository'],
    }
  ],
})
export class ActivityModule {}

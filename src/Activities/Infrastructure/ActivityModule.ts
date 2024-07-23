import { Module } from '@nestjs/common';
import { ActivityController } from './ActivityController';
import { ActivityService } from '../Domain/Services/ActivityService';
import { ActivityUseCase } from '../Application/UseCases/ActivityUseCase';
import { ActivityRepositoryImpl } from './Adapters/ActivityRepositoryImpl';

@Module({
  controllers: [
    ActivityController
  ],
  providers: [
    ActivityService,
    ActivityUseCase,
    {
      provide: 'ActivityRepository',
      useClass: ActivityRepositoryImpl
    }
  ],
})
export class ActivityModule { }
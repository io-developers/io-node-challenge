import { Controller } from '@nestjs/common';
import { ActivityUseCase } from '../Application/UseCases/ActivityUseCase';
import { ActivityRequestDTO } from '../Application/DTOs/ActivityRequestDTO';
import { ActivityResponseDTO } from '../Application/DTOs/ActivityResponseDTO';

@Controller()
export class ActivityController {
  private readonly activityUseCase: ActivityUseCase;

  constructor(activityUseCase: ActivityUseCase) {
    this.activityUseCase = activityUseCase;
  }

  async execute(action: string, request: object): Promise<object> {
    console.log('-- ActivityController.execute --');
    console.log({
      action,
      request
    });
    return this[action](request);
  }

  async create(activityRequest: ActivityRequestDTO): Promise<ActivityResponseDTO> {
    console.log('-- ActivityController.create --');
    return this.activityUseCase.createActivity(activityRequest);
  }

}
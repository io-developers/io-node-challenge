import { Body, Controller, Get, Inject, Post, Logger, ConflictException } from '@nestjs/common';
import { ActivityService } from '../aplication/activity.service';
import { ActivityRequestDTO } from './dto/activity.request.dto';
import { DynamoDbException } from '../domain/exception/dynamodb.excepciont';

@Controller()
export class ActivityController {
  constructor(@Inject('ActivityService') private readonly activityService: ActivityService,private readonly logger: Logger) {}

  @Post()
  registerActivity(@Body() request: ActivityRequestDTO) {
    this.logger.log('Start registre Activity', 'ActivityController - registerActivity');
    this.logger.log(`Payload: ${JSON.stringify(request)}`, 'ActivityController - registerActivity');
    try {
      return this.activityService.registerActivity(request);
    } catch (error) {
      if (error instanceof DynamoDbException) {
        this.logger.error(`DynamoDB Error ${JSON.stringify(error)}`, 'ActivityController - registerActivity');
        throw new DynamoDbException('Error al insertar en DynamoDB')
      }
      this.logger.error(`Error Generico ${JSON.stringify(error)}`, 'ActivityController - registerActivity');
      throw error
    }
  }
}

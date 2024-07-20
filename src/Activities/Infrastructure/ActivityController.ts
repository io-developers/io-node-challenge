import { Controller, Get } from '@nestjs/common';

@Controller('v1/activities')
export class ActivitiesController {
    constructor() {}

    @Get()
    async getActivities() {
        return 'Activities';
    }
}
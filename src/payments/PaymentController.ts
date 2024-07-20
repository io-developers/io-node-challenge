import { Controller, Get } from '@nestjs/common';

@Controller('v1/payments')
export class PaymentController {
    constructor() {}

    @Get()
    getHello(): string {
        return 'Hello World!';
    }
}
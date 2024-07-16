import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { MocksService } from '../aplication/mocks.service';
import { PaymentRequestDto } from './dto/payment.request.dto';

@Controller('payments')
export class MocksController {
  constructor(@Inject('MocksService') private readonly mocksService: MocksService, private readonly logger: Logger) {}

  @Post()
  executePayment(@Body() request: PaymentRequestDto ) {
    this.logger.log('Start to execute Payments', 'MocksController - executePayment');
    this.logger.log(`Payload: ${JSON.stringify(request)}`, 'MocksController - executePayment');
    return this.mocksService.executePayment(request);
  }
}

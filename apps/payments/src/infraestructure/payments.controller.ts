import { Body, Controller,  HttpException,  HttpStatus,  Inject,  Logger,  Post } from '@nestjs/common';
import { PaymentsService } from '../aplication/payments.service';
import { PaymentRequestDto } from './dto/payment.request.dto';
import { HttpError } from '../domain/exceptions/payment.exception';

@Controller("payment")
export class PaymentsController {
  constructor(@Inject('PaymentsService') private readonly paymentsService: PaymentsService, private readonly logger: Logger) {}

  @Post()
  exectPayments(@Body() request: PaymentRequestDto) {
    this.logger.log('Start to execute payments', 'PaymentsController - exectPayments');
    this.logger.log(`Payload: ${JSON.stringify(request)}`, 'PaymentsController - exectPayments');
    try {
      return this.paymentsService.executePayments(request);
    } catch (error) {
      if (error instanceof HttpError) {
        this.logger.error(`Http Error ${JSON.stringify(error)}`, 'PaymentsController - exectPayments');
        throw new HttpException('Api Mock devolvio error', HttpStatus.SERVICE_UNAVAILABLE);
      }
      this.logger.error(`Error Generico ${JSON.stringify(error)}`, 'PaymentsController - exectPayments');
      throw error
    }
  }
}

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaymentValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value.bookingId || Number(value.bookingId) <= 0) {
      throw new BadRequestException('Valid bookingId is required');
    }
    if (!value.month) {
      throw new BadRequestException('Payment month is required');
    }
    if (!value.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }
    value.bookingId = Number(value.bookingId);
    return value;
  }
}
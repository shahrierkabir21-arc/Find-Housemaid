import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PhoneValidationPipe implements PipeTransform {
  transform(value: any) {
    const phoneRegex = /^[0-9]+$/;
    if (!value.phone || !phoneRegex.test(value.phone)) {
      throw new BadRequestException('Phone must contain only numbers');
    }
    return value;
  }
}
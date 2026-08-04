import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmployerValidationPipe implements PipeTransform {
  transform(value: any) {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!value.fullName || !nameRegex.test(value.fullName)) {
      throw new BadRequestException('Full name must contain alphabets only');
    }

    if (!value.email || !emailRegex.test(value.email)) {
      throw new BadRequestException('Valid email is required');
    }

    if (!value.password || value.password.length < 6) {
      throw new BadRequestException('Password must be minimum 6 characters');
    }

    if (!value.phone || !phoneRegex.test(value.phone)) {
      throw new BadRequestException('Phone must contain only numbers');
    }

    value.email = value.email.toLowerCase();
    return value;
  }
}
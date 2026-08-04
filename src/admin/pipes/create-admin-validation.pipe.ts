import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CreateAdminValidationPipe implements PipeTransform {
  transform(value: any) {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    const nidRegex = /^(?:\d{10}|\d{13}|\d{17})$/;
    const phoneRegex = /^[0-9]+$/;

    if (value.fullName && !nameRegex.test(value.fullName)) {
      throw new BadRequestException('Full name must contain alphabets only');
    }

    if (value.fullName && value.fullName.length > 100) {
      throw new BadRequestException(
        'Full name must not be more than 100 characters',
      );
    }

    if (!value.email || !emailRegex.test(value.email)) {
      throw new BadRequestException('Email must contain @ and end with .com');
    }

    if (!value.password || value.password.length < 6) {
      throw new BadRequestException('Password must be minimum 6 characters');
    }

    if (!value.nidNumber || !nidRegex.test(value.nidNumber)) {
      throw new BadRequestException('NID must contain 10, 13, or 17 digits');
    }

    if (!value.phone || !phoneRegex.test(value.phone)) {
      throw new BadRequestException('Phone must contain only numbers');
    }

    value.email = value.email.toLowerCase();
    return value;
  }
}
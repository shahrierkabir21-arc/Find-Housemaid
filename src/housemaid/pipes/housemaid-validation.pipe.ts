import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class HousemaidValidationPipe implements PipeTransform {
  transform(value: any) {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nidRegex = /^(?:\d{10}|\d{13}|\d{17})$/;
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

    if (!value.nidNumber || !nidRegex.test(value.nidNumber)) {
      throw new BadRequestException('NID must contain 10, 13, or 17 digits');
    }

    if (!value.phone || !phoneRegex.test(value.phone)) {
      throw new BadRequestException('Phone must contain only numbers');
    }

    if (Number(value.experience) < 0) {
      throw new BadRequestException('Experience cannot be negative');
    }

    if (Number(value.expectedSalary) <= 0) {
      throw new BadRequestException('Expected salary must be positive');
    }

    value.email = value.email.toLowerCase();
    value.experience = Number(value.experience);
    value.expectedSalary = Number(value.expectedSalary);
    return value;
  }
}
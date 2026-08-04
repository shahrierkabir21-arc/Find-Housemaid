import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeMail(email: string, name: string, role: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Housemaid Search Hub',
        text: `Hello ${name}, your ${role} account has been created successfully.`,
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendPaymentMail(email: string, amount: number) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Monthly Payment Created',
        text: `Your monthly payment amount is ${amount} taka.`,
      });
      return true;
    } catch {
      return false;
    }
  }
}
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { BookingEntity } from '../booking/booking.entity';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PaymentStatus } from '../common/enums';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(AdminProfileEntity)
    private readonly adminRepository: Repository<AdminProfileEntity>,
    private readonly mailService: MailService,
  ) {}

  async createMonthlyPayment(
    adminUserId: number,
    createPaymentDto: CreatePaymentDto,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { user: { id: adminUserId } },
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id: createPaymentDto.bookingId },
      relations: {
        employer: {
          user: true,
        },
        housemaid: {
          user: true,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const monthlySalary = booking.monthlySalary;
    const employerFeeAmount = Math.round(monthlySalary * 0.05);
    const housemaidFeeAmount = Math.round(monthlySalary * 0.08);

    const employerTotalPayment = monthlySalary + employerFeeAmount;
    const housemaidNetSalary = monthlySalary - housemaidFeeAmount;
    const companyRevenue = employerFeeAmount + housemaidFeeAmount;

    const payment = this.paymentRepository.create({
      month: createPaymentDto.month,
      monthlySalary,
      employerFeePercent: 5,
      employerFeeAmount,
      housemaidFeePercent: 8,
      housemaidFeeAmount,
      employerTotalPayment,
      housemaidNetSalary,
      companyRevenue,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: createPaymentDto.paymentMethod,
      booking,
      employer: booking.employer,
      housemaid: booking.housemaid,
      admin,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    await this.mailService.sendPaymentMail(
      booking.employer.user.email,
      employerTotalPayment,
    );

    return {
      message: 'Monthly payment created successfully',
      formula: {
        employerServiceCharge: 'Monthly Salary x 5%',
        housemaidCommission: 'Monthly Salary x 8%',
        companyRevenue:
          'Employer Service Charge + Housemaid Commission',
      },
      data: savedPayment,
    };
  }

  async getAllPayments() {
    const payments = await this.paymentRepository.find({
      relations: {
        booking: true,
        employer: true,
        housemaid: true,
        admin: true,
      },
    });

    return {
      message: 'Payments fetched successfully',
      total: payments.length,
      data: payments,
    };
  }

  async getPaymentById(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: {
        booking: true,
        employer: true,
        housemaid: true,
        admin: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      message: 'Payment fetched successfully',
      data: payment,
    };
  }

  async updatePaymentStatus(
    id: number,
    updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const allowedStatus = [
      PaymentStatus.PENDING,
      PaymentStatus.PAID,
      PaymentStatus.HOLD,
      PaymentStatus.RELEASED,
      PaymentStatus.FAILED,
    ];

    if (!allowedStatus.includes(updatePaymentStatusDto.status)) {
      throw new BadRequestException('Invalid payment status');
    }

    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.paymentStatus = updatePaymentStatusDto.status;
    const updatedPayment = await this.paymentRepository.save(payment);

    return {
      message: 'Payment status updated successfully',
      data: updatedPayment,
    };
  }

  async deletePayment(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.paymentRepository.remove(payment);

    return {
      message: 'Payment deleted successfully',
      data: payment,
    };
  }
}
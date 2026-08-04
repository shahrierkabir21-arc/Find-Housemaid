import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { AdminProfileEntity } from './entities/admin-profile.entity';
import { HousemaidProfileEntity } from '../housemaid/entities/housemaid-profile.entity';
import { JobRequestEntity } from '../employer/entities/job-request.entity';
import { BookingEntity } from '../booking/booking.entity';
import { PaymentEntity } from '../payment/payment.entity';
import {
  BookingStatus,
  JobStatus,
  UserRole,
  UserStatus,
  VerificationStatus,
} from '../common/enums';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { VerifyHousemaidDto } from './dto/verify-housemaid.dto';
import { AssignBookingDto } from './dto/assign-booking.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AdminProfileEntity)
    private readonly adminRepository: Repository<AdminProfileEntity>,
    @InjectRepository(HousemaidProfileEntity)
    private readonly housemaidRepository: Repository<HousemaidProfileEntity>,
    @InjectRepository(JobRequestEntity)
    private readonly jobRequestRepository: Repository<JobRequestEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly mailService: MailService,
  ) {}

  private removePassword(user: UserEntity) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async createAdmin(createAdminDto: CreateAdminDto, nidImage: any) {
    const emailExists = await this.userRepository.findOne({
      where: { email: createAdminDto.email.toLowerCase() },
    });

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const user = this.userRepository.create({
      fullName: createAdminDto.fullName ?? null,
      email: createAdminDto.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    const profile = this.adminRepository.create({
      nidNumber: createAdminDto.nidNumber,
      nidImage: nidImage.originalname,
      phone: createAdminDto.phone,
      user: savedUser,
    });

    const savedProfile = await this.adminRepository.save(profile);

    await this.mailService.sendWelcomeMail(
      savedUser.email,
      savedUser.fullName || 'Admin',
      'Admin',
    );

    return {
      message: 'Admin created successfully',
      data: {
        user: this.removePassword(savedUser),
        profile: savedProfile,
      },
    };
  }

  async getProfile(userId: number) {
    const profile = await this.adminRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (!profile) {
      throw new NotFoundException('Admin profile not found');
    }

    return {
      message: 'Admin profile fetched successfully',
      data: profile,
    };
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Users fetched successfully',
      total: users.length,
      data: users.map((user) => this.removePassword(user)),
    };
  }

  async updateUserStatus(
    userId: number,
    updateUserStatusDto: UpdateUserStatusDto,
  ) {
    const allowedStatus = [
      UserStatus.ACTIVE,
      UserStatus.INACTIVE,
      UserStatus.BLOCKED,
    ];

    if (!allowedStatus.includes(updateUserStatusDto.status)) {
      throw new BadRequestException(
        'Status must be active, inactive, or blocked',
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = updateUserStatusDto.status;
    const updatedUser = await this.userRepository.save(user);

    return {
      message: 'User status updated successfully',
      data: this.removePassword(updatedUser),
    };
  }

  async verifyHousemaid(
    housemaidId: number,
    verifyHousemaidDto: VerifyHousemaidDto,
  ) {
    const housemaid = await this.housemaidRepository.findOne({
      where: { id: housemaidId },
      relations: { user: true },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    const allowedStatus = [
      VerificationStatus.APPROVED,
      VerificationStatus.REJECTED,
      VerificationStatus.PENDING,
    ];

    if (!allowedStatus.includes(verifyHousemaidDto.status)) {
      throw new BadRequestException(
        'Status must be approved, rejected, or pending',
      );
    }

    housemaid.verificationStatus = verifyHousemaidDto.status;

    if (verifyHousemaidDto.status === VerificationStatus.APPROVED) {
      housemaid.user.status = UserStatus.ACTIVE;
    }

    if (verifyHousemaidDto.status === VerificationStatus.REJECTED) {
      housemaid.user.status = UserStatus.INACTIVE;
    }

    await this.userRepository.save(housemaid.user);
    const updatedHousemaid = await this.housemaidRepository.save(housemaid);

    return {
      message: 'Housemaid verification updated successfully',
      data: updatedHousemaid,
    };
  }

  async assignHousemaidToJob(
    adminUserId: number,
    assignBookingDto: AssignBookingDto,
  ) {
    if (assignBookingDto.monthlySalary <= 0) {
      throw new BadRequestException('Monthly salary must be positive');
    }

    const admin = await this.adminRepository.findOne({
      where: { user: { id: adminUserId } },
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id: assignBookingDto.jobRequestId },
      relations: { employer: true },
    });

    if (!jobRequest) {
      throw new NotFoundException('Job request not found');
    }

    const housemaid = await this.housemaidRepository.findOne({
      where: { id: assignBookingDto.housemaidId },
      relations: { user: true },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    if (housemaid.verificationStatus !== VerificationStatus.APPROVED) {
      throw new HttpException(
        'Housemaid is not approved',
        HttpStatus.BAD_REQUEST,
      );
    }

    const booking = this.bookingRepository.create({
      jobRequest,
      employer: jobRequest.employer,
      housemaid,
      admin,
      monthlySalary: assignBookingDto.monthlySalary,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    jobRequest.status = JobStatus.ASSIGNED;
    await this.jobRequestRepository.save(jobRequest);

    return {
      message: 'Housemaid assigned and booking created successfully',
      data: savedBooking,
    };
  }

  async getPendingJobRequests() {
    const jobRequests = await this.jobRequestRepository.find({
      where: { status: JobStatus.PENDING },
      relations: {
        employer: {
          user: true,
        },
      },
    });

    return {
      message: 'Pending job requests fetched successfully',
      total: jobRequests.length,
      data: jobRequests,
    };
  }

  async getPaymentReport() {
    const payments = await this.paymentRepository.find();

    const totalCompanyRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.companyRevenue),
      0,
    );

    return {
      message: 'Payment report fetched successfully',
      totalPayments: payments.length,
      totalCompanyRevenue,
      data: payments,
    };
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully',
      data: this.removePassword(user),
    };
  }
}
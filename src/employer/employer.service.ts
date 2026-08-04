import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { EmployerProfileEntity } from './entities/employer-profile.entity';
import { JobRequestEntity } from './entities/job-request.entity';
import { BookingEntity } from '../booking/booking.entity';
import { ReviewEntity } from './entities/review.entity';
import { BookingStatus, JobStatus, UserRole, UserStatus } from '../common/enums';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EmployerProfileEntity)
    private readonly employerRepository: Repository<EmployerProfileEntity>,
    @InjectRepository(JobRequestEntity)
    private readonly jobRequestRepository: Repository<JobRequestEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly mailService: MailService,
  ) {}

  private removePassword(user: UserEntity) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(createEmployerDto: CreateEmployerDto) {
    const emailExists = await this.userRepository.findOne({
      where: { email: createEmployerDto.email.toLowerCase() },
    });

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createEmployerDto.password, 10);

    const user = this.userRepository.create({
      fullName: createEmployerDto.fullName,
      email: createEmployerDto.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.EMPLOYER,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    const employer = this.employerRepository.create({
      phone: createEmployerDto.phone,
      address: createEmployerDto.address,
      city: createEmployerDto.city,
      area: createEmployerDto.area,
      houseType: createEmployerDto.houseType,
      user: savedUser,
    });

    const savedEmployer = await this.employerRepository.save(employer);

    await this.mailService.sendWelcomeMail(
      savedUser.email,
      savedUser.fullName || 'Employer',
      'Employer',
    );

    return {
      message: 'Employer registered successfully',
      data: {
        user: this.removePassword(savedUser),
        profile: savedEmployer,
      },
    };
  }

  async getProfile(id: number) {
    const employer = await this.employerRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    return {
      message: 'Employer profile fetched successfully',
      data: employer,
    };
  }

  async updateProfile(id: number, updateEmployerDto: UpdateEmployerDto) {
    const employer = await this.employerRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    if (updateEmployerDto.fullName) {
      employer.user.fullName = updateEmployerDto.fullName;
    }
    if (updateEmployerDto.phone) {
      employer.phone = updateEmployerDto.phone;
    }
    if (updateEmployerDto.address) {
      employer.address = updateEmployerDto.address;
    }
    if (updateEmployerDto.city) {
      employer.city = updateEmployerDto.city;
    }
    if (updateEmployerDto.area) {
      employer.area = updateEmployerDto.area;
    }
    if (updateEmployerDto.houseType) {
      employer.houseType = updateEmployerDto.houseType;
    }

    await this.userRepository.save(employer.user);
    const updatedEmployer = await this.employerRepository.save(employer);

    return {
      message: 'Employer updated successfully',
      data: updatedEmployer,
    };
  }

  async createJobRequest(
    employerId: number,
    createJobRequestDto: CreateJobRequestDto,
  ) {
    const employer = await this.employerRepository.findOne({
      where: { id: employerId },
    });

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    if (Number(createJobRequestDto.budget) <= 0) {
      throw new BadRequestException('Budget must be positive');
    }

    const jobRequest = this.jobRequestRepository.create({
      ...createJobRequestDto,
      budget: Number(createJobRequestDto.budget),
      status: JobStatus.PENDING,
      employer,
    });

    const savedJob = await this.jobRequestRepository.save(jobRequest);

    return {
      message: 'Job request created successfully',
      data: savedJob,
    };
  }

  async getJobRequests(employerId: number) {
    const employer = await this.employerRepository.findOne({
      where: { id: employerId },
    });

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    const jobRequests = await this.jobRequestRepository.find({
      where: { employer: { id: employerId } },
    });

    return {
      message: 'Employer job requests fetched successfully',
      total: jobRequests.length,
      data: jobRequests,
    };
  }

  async deleteJobRequest(jobRequestId: number) {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id: jobRequestId },
    });

    if (!jobRequest) {
      throw new NotFoundException('Job request not found');
    }

    await this.jobRequestRepository.remove(jobRequest);

    return {
      message: 'Job request deleted successfully',
      data: jobRequest,
    };
  }

  async getBookings(employerId: number) {
    const bookings = await this.bookingRepository.find({
      where: { employer: { id: employerId } },
      relations: {
        jobRequest: true,
        housemaid: {
          user: true,
        },
      },
    });

    return {
      message: 'Employer bookings fetched successfully',
      total: bookings.length,
      data: bookings,
    };
  }

  async confirmBooking(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = BookingStatus.CONFIRMED;
    const updatedBooking = await this.bookingRepository.save(booking);

    return {
      message: 'Booking confirmed successfully',
      data: updatedBooking,
    };
  }

  async createReview(bookingId: number, createReviewDto: CreateReviewDto) {
    if (
      Number(createReviewDto.rating) < 1 ||
      Number(createReviewDto.rating) > 5
    ) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: {
        employer: true,
        housemaid: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const review = this.reviewRepository.create({
      rating: Number(createReviewDto.rating),
      comment: createReviewDto.comment,
      booking,
      employer: booking.employer,
      housemaid: booking.housemaid,
    });

    const savedReview = await this.reviewRepository.save(review);

    return {
      message: 'Review created successfully',
      data: savedReview,
    };
  }
}
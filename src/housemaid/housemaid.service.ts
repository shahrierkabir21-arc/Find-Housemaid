import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { HousemaidProfileEntity } from './entities/housemaid-profile.entity';
import { SkillEntity } from './entities/skill.entity';
import { BookingEntity } from '../booking/booking.entity';
import {
  BookingStatus,
  UserRole,
  UserStatus,
  VerificationStatus,
} from '../common/enums';
import { CreateHousemaidDto } from './dto/create-housemaid.dto';
import { UpdateHousemaidDto } from './dto/update-housemaid.dto';
import { RespondBookingDto } from './dto/respond-booking.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class HousemaidService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HousemaidProfileEntity)
    private readonly housemaidRepository: Repository<HousemaidProfileEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly mailService: MailService,
  ) {}

  private removePassword(user: UserEntity) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(
    createHousemaidDto: CreateHousemaidDto,
    nidImage: any,
  ) {
    const emailExists = await this.userRepository.findOne({
      where: { email: createHousemaidDto.email.toLowerCase() },
    });

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createHousemaidDto.password,
      10,
    );

    const user = this.userRepository.create({
      fullName: createHousemaidDto.fullName,
      email: createHousemaidDto.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.HOUSEMAID,
      status: UserStatus.INACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    const skills: SkillEntity[] = [];

    if (createHousemaidDto.skills) {
      const skillList =
        typeof createHousemaidDto.skills === 'string'
          ? String(createHousemaidDto.skills).split(',')
          : createHousemaidDto.skills;

      for (const skillName of skillList) {
        const cleanName = skillName.trim().toLowerCase();
        let skill = await this.skillRepository.findOne({
          where: { name: cleanName },
        });

        if (!skill) {
          skill = await this.skillRepository.save(
            this.skillRepository.create({ name: cleanName }),
          );
        }
        skills.push(skill);
      }
    }

    const housemaid = this.housemaidRepository.create({
      nidNumber: createHousemaidDto.nidNumber,
      nidImage: nidImage.originalname,
      phone: createHousemaidDto.phone,
      experience: Number(createHousemaidDto.experience),
      expectedSalary: Number(createHousemaidDto.expectedSalary),
      availability: createHousemaidDto.availability,
      location: createHousemaidDto.location,
      verificationStatus: VerificationStatus.PENDING,
      user: savedUser,
      skills,
    });

    const savedHousemaid = await this.housemaidRepository.save(housemaid);

    await this.mailService.sendWelcomeMail(
      savedUser.email,
      savedUser.fullName || 'Housemaid',
      'Housemaid',
    );

    return {
      message: 'Housemaid registered successfully. Wait for admin approval.',
      data: {
        user: this.removePassword(savedUser),
        profile: savedHousemaid,
      },
    };
  }

  async getProfile(id: number) {
    const housemaid = await this.housemaidRepository.findOne({
      where: { id },
      relations: {
        user: true,
        skills: true,
      },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    return {
      message: 'Housemaid profile fetched successfully',
      data: housemaid,
    };
  }

  async getApprovedHousemaids() {
    const housemaids = await this.housemaidRepository.find({
      where: { verificationStatus: VerificationStatus.APPROVED },
      relations: {
        user: true,
        skills: true,
      },
    });

    return {
      message: 'Approved housemaids fetched successfully',
      total: housemaids.length,
      data: housemaids,
    };
  }

  async updateProfile(
    id: number,
    updateHousemaidDto: UpdateHousemaidDto,
  ) {
    const housemaid = await this.housemaidRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    if (updateHousemaidDto.fullName) {
      housemaid.user.fullName = updateHousemaidDto.fullName;
    }
    if (updateHousemaidDto.phone) {
      housemaid.phone = updateHousemaidDto.phone;
    }
    if (updateHousemaidDto.experience !== undefined) {
      housemaid.experience = Number(updateHousemaidDto.experience);
    }
    if (updateHousemaidDto.expectedSalary !== undefined) {
      housemaid.expectedSalary = Number(updateHousemaidDto.expectedSalary);
    }
    if (updateHousemaidDto.availability) {
      housemaid.availability = updateHousemaidDto.availability;
    }
    if (updateHousemaidDto.location) {
      housemaid.location = updateHousemaidDto.location;
    }

    await this.userRepository.save(housemaid.user);
    const updatedHousemaid = await this.housemaidRepository.save(housemaid);

    return {
      message: 'Housemaid updated successfully',
      data: updatedHousemaid,
    };
  }

  async addSkill(id: number, skillName: string) {
    if (!skillName) {
      throw new BadRequestException('Skill name is required');
    }

    const housemaid = await this.housemaidRepository.findOne({
      where: { id },
      relations: { skills: true },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    const cleanName = skillName.toLowerCase();
    let skill = await this.skillRepository.findOne({
      where: { name: cleanName },
    });

    if (!skill) {
      skill = await this.skillRepository.save(
        this.skillRepository.create({ name: cleanName }),
      );
    }

    housemaid.skills = [...(housemaid.skills || []), skill];
    const updatedHousemaid = await this.housemaidRepository.save(housemaid);

    return {
      message: 'Skill added successfully',
      data: updatedHousemaid,
    };
  }

  async removeSkill(housemaidId: number, skillId: number) {
    const housemaid = await this.housemaidRepository.findOne({
      where: { id: housemaidId },
      relations: { skills: true },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    housemaid.skills = housemaid.skills.filter(
      (skill) => skill.id !== skillId,
    );

    const updatedHousemaid = await this.housemaidRepository.save(housemaid);

    return {
      message: 'Skill removed successfully',
      data: updatedHousemaid,
    };
  }

  async getAssignedJobs(housemaidId: number) {
    const bookings = await this.bookingRepository.find({
      where: { housemaid: { id: housemaidId } },
      relations: {
        jobRequest: true,
        employer: {
          user: true,
        },
      },
    });

    return {
      message: 'Assigned jobs fetched successfully',
      total: bookings.length,
      data: bookings,
    };
  }

  async respondBooking(
    bookingId: number,
    respondBookingDto: RespondBookingDto,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (respondBookingDto.status === 'accepted') {
      booking.status = BookingStatus.ACCEPTED;
    } else if (respondBookingDto.status === 'rejected') {
      booking.status = BookingStatus.REJECTED;
    } else {
      throw new BadRequestException('Status must be accepted or rejected');
    }

    const updatedBooking = await this.bookingRepository.save(booking);

    return {
      message: 'Booking response updated successfully',
      data: updatedBooking,
    };
  }

  async updateAvailability(id: number, availability: string) {
    const housemaid = await this.housemaidRepository.findOne({
      where: { id },
    });

    if (!housemaid) {
      throw new NotFoundException('Housemaid not found');
    }

    housemaid.availability = availability;
    const updatedHousemaid = await this.housemaidRepository.save(housemaid);

    return {
      message: 'Availability updated successfully',
      data: updatedHousemaid,
    };
  }
}
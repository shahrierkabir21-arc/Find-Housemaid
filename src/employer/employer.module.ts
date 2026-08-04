import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { UserEntity } from '../users/user.entity';
import { EmployerProfileEntity } from './entities/employer-profile.entity';
import { JobRequestEntity } from './entities/job-request.entity';
import { BookingEntity } from '../booking/booking.entity';
import { ReviewEntity } from './entities/review.entity';
import { CommonModule } from '../common/common.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EmployerProfileEntity,
      JobRequestEntity,
      BookingEntity,
      ReviewEntity,
    ]),
    CommonModule,
    MailModule,
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
})
export class EmployerModule {}
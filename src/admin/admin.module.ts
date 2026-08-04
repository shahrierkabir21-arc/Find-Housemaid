
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserEntity } from '../users/user.entity';
import { AdminProfileEntity } from './entities/admin-profile.entity';
import { HousemaidProfileEntity } from '../housemaid/entities/housemaid-profile.entity';
import { JobRequestEntity } from '../employer/entities/job-request.entity';
import { BookingEntity } from '../booking/booking.entity';
import { PaymentEntity } from '../payment/payment.entity';
import { CommonModule } from '../common/common.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AdminProfileEntity,
      HousemaidProfileEntity,
      JobRequestEntity,
      BookingEntity,
      PaymentEntity,
    ]),
    CommonModule,
    MailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
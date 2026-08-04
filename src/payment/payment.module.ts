import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './payment.entity';
import { BookingEntity } from '../booking/booking.entity';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';
import { UserEntity } from '../users/user.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      BookingEntity,
      AdminProfileEntity,
      UserEntity,
    ]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
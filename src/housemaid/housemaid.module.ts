import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousemaidController } from './housemaid.controller';
import { HousemaidService } from './housemaid.service';
import { UserEntity } from '../users/user.entity';
import { HousemaidProfileEntity } from './entities/housemaid-profile.entity';
import { SkillEntity } from './entities/skill.entity';
import { BookingEntity } from '../booking/booking.entity';
import { CommonModule } from '../common/common.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      HousemaidProfileEntity,
      SkillEntity,
      BookingEntity,
    ]),
    CommonModule,
    MailModule,
  ],
  controllers: [HousemaidController],
  providers: [HousemaidService],
})
export class HousemaidModule {}
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { JobRequestEntity } from './job-request.entity';
import { BookingEntity } from '../../booking/booking.entity';
import { PaymentEntity } from '../../payment/payment.entity';
import { ReviewEntity } from './review.entity';

@Entity('employer_profiles')
export class EmployerProfileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'bigint',
  })
  phone!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  area!: string;

  @Column()
  houseType!: string;

  @OneToOne(() => UserEntity, (user) => user.employerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: UserEntity;

  @OneToMany(() => JobRequestEntity, (job) => job.employer)
  jobRequests!: JobRequestEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.employer)
  bookings!: BookingEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.employer)
  payments!: PaymentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.employer)
  reviews!: ReviewEntity[];
}
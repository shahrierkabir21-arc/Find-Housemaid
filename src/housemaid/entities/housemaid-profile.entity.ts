import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { SkillEntity } from './skill.entity';
import { BookingEntity } from '../../booking/booking.entity';
import { PaymentEntity } from '../../payment/payment.entity';
import { ReviewEntity } from '../../employer/entities/review.entity';
import { VerificationStatus } from '../../common/enums';

@Entity('housemaid_profiles')
export class HousemaidProfileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nidNumber!: string;

  @Column()
  nidImage!: string;

  @Column({
    type: 'bigint',
  })
  phone!: string;

  @Column({ type: 'int' })
  experience!: number;

  @Column({ type: 'int' })
  expectedSalary!: number;

  @Column()
  availability!: string;

  @Column()
  location!: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus!: VerificationStatus;

  @OneToOne(() => UserEntity, (user) => user.housemaidProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: UserEntity;

  @ManyToMany(() => SkillEntity, (skill) => skill.housemaids, {
    cascade: true,
  })
  @JoinTable()
  skills!: SkillEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.housemaid)
  bookings!: BookingEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.housemaid)
  payments!: PaymentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.housemaid)
  reviews!: ReviewEntity[];
}
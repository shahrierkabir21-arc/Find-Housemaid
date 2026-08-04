import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { BookingEntity } from '../../booking/booking.entity';
import { PaymentEntity } from '../../payment/payment.entity';

@Entity('admin_profiles')
export class AdminProfileEntity {
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

  @OneToOne(() => UserEntity, (user) => user.adminProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: UserEntity;

  @OneToMany(() => BookingEntity, (booking) => booking.admin)
  bookings!: BookingEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.admin)
  payments!: PaymentEntity[];
}
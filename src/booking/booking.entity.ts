import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobRequestEntity } from '../employer/entities/job-request.entity';
import { EmployerProfileEntity } from '../employer/entities/employer-profile.entity';
import { HousemaidProfileEntity } from '../housemaid/entities/housemaid-profile.entity';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';
import { PaymentEntity } from '../payment/payment.entity';
import { BookingStatus } from '../common/enums';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  monthlySalary!: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @OneToOne(() => JobRequestEntity, (job) => job.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  jobRequest!: JobRequestEntity;

  @ManyToOne(
    () => EmployerProfileEntity,
    (employer) => employer.bookings,
  )
  employer!: EmployerProfileEntity;

  @ManyToOne(
    () => HousemaidProfileEntity,
    (housemaid) => housemaid.bookings,
  )
  housemaid!: HousemaidProfileEntity;

  @ManyToOne(() => AdminProfileEntity, (admin) => admin.bookings)
  admin!: AdminProfileEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.booking)
  payments!: PaymentEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingEntity } from '../booking/booking.entity';
import { EmployerProfileEntity } from '../employer/entities/employer-profile.entity';
import { HousemaidProfileEntity } from '../housemaid/entities/housemaid-profile.entity';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';
import { PaymentStatus } from '../common/enums';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  month!: string;

  @Column({ type: 'int' })
  monthlySalary!: number;

  @Column({ type: 'int', default: 5 })
  employerFeePercent!: number;

  @Column({ type: 'int' })
  employerFeeAmount!: number;

  @Column({ type: 'int', default: 8 })
  housemaidFeePercent!: number;

  @Column({ type: 'int' })
  housemaidFeeAmount!: number;

  @Column({ type: 'int' })
  employerTotalPayment!: number;

  @Column({ type: 'int' })
  housemaidNetSalary!: number;

  @Column({ type: 'int' })
  companyRevenue!: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @Column()
  paymentMethod!: string;

  @ManyToOne(() => BookingEntity, (booking) => booking.payments)
  booking!: BookingEntity;

  @ManyToOne(() => EmployerProfileEntity, (employer) => employer.payments)
  employer!: EmployerProfileEntity;

  @ManyToOne(() => HousemaidProfileEntity, (housemaid) => housemaid.payments)
  housemaid!: HousemaidProfileEntity;

  @ManyToOne(() => AdminProfileEntity, (admin) => admin.payments)
  admin!: AdminProfileEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
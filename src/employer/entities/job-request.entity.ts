import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployerProfileEntity } from './employer-profile.entity';
import { BookingEntity } from '../../booking/booking.entity';
import { JobStatus } from '../../common/enums';

@Entity('job_requests')
export class JobRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  workType!: string;

  @Column()
  description!: string;

  @Column()
  location!: string;

  @Column()
  workDate!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column({ type: 'int' })
  budget!: number;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PENDING,
  })
  status!: JobStatus;

  @ManyToOne(
    () => EmployerProfileEntity,
    (employer) => employer.jobRequests,
    { onDelete: 'CASCADE' },
  )
  employer!: EmployerProfileEntity;

  @OneToOne(() => BookingEntity, (booking) => booking.jobRequest)
  booking!: BookingEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
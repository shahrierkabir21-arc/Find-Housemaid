import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingEntity } from '../../booking/booking.entity';
import { EmployerProfileEntity } from './employer-profile.entity';
import { HousemaidProfileEntity } from '../../housemaid/entities/housemaid-profile.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  rating!: number;

  @Column()
  comment!: string;

  @OneToOne(() => BookingEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  booking!: BookingEntity;

  @ManyToOne(() => EmployerProfileEntity, (employer) => employer.reviews)
  employer!: EmployerProfileEntity;

  @ManyToOne(() => HousemaidProfileEntity, (housemaid) => housemaid.reviews)
  housemaid!: HousemaidProfileEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
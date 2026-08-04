import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole, UserStatus } from '../common/enums';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';
import { EmployerProfileEntity } from '../employer/entities/employer-profile.entity';
import { HousemaidProfileEntity } from '../housemaid/entities/housemaid-profile.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  fullName!: string | null;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @OneToOne(() => AdminProfileEntity, (profile) => profile.user)
  adminProfile!: AdminProfileEntity;

  @OneToOne(() => EmployerProfileEntity, (profile) => profile.user)
  employerProfile!: EmployerProfileEntity;

  @OneToOne(() => HousemaidProfileEntity, (profile) => profile.user)
  housemaidProfile!: HousemaidProfileEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(100000 + Math.random() * 900000);
  }
}
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HousemaidProfileEntity } from './housemaid-profile.entity';

@Entity('skills')
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => HousemaidProfileEntity, (housemaid) => housemaid.skills)
  housemaids!: HousemaidProfileEntity[];
}
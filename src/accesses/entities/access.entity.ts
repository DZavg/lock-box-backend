import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../../projects/entities/project.entity';

@Entity('acesses')
export class Access {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  origin: string;

  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  type: string;

  @Exclude()
  @ManyToOne(() => Project, (project) => project.accesses, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  project: Project;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;
}

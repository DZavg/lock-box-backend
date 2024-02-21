import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  title: string;

  @Column()
  domain: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.projects, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;
}

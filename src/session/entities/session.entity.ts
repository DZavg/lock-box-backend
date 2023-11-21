import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'access_token', unique: true })
  accessToken: string;

  @Column({ name: 'refresh_token', unique: true })
  refreshToken: string;

  @Column({ type: 'boolean' })
  revoked: boolean;

  @ManyToOne(() => User, (user) => user.sessions, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ name: 'created_id' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

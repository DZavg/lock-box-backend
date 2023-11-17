import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_id' })
  createdAt: Date;
}

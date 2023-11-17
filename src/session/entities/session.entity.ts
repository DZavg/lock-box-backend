import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @CreateDateColumn({ name: 'created_id' })
  createdAt: Date;
}

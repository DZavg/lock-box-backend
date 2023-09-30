import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('access_tokens')
export class accessToken {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  token: string;

  @Column({ type: 'boolean' })
  revoked: boolean;

  @Column()
  expiredAt: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @CreateDateColumn({ name: 'created_id' })
  createdAt: Date;
}

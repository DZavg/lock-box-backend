import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Session } from '../../sessions/entities/session.entity';
import { ConfirmationCode } from '@/confirmation-codes/entities/confirmation-code.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column()
  username: string;

  @OneToOne(
    () => ConfirmationCode,
    (confirmationCode) => confirmationCode.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  confirmationCode: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @Exclude()
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  constructor(partial: Partial<User> = {}) {
    Object.assign(this, partial);
  }
}

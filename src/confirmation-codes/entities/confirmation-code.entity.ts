import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { CreateConfirmationCodeDto } from '../dto/create-confirmation-code.dto';
import { User } from '../../users/entities/user.entity';

@Entity('confirmationCode')
export class ConfirmationCode {
  @Exclude()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  code: string;

  @OneToOne(() => User, (user) => user.confirmationCode)
  user: User;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  constructor(partial: Partial<CreateConfirmationCodeDto> = {}) {
    Object.assign(this, partial);
  }
}

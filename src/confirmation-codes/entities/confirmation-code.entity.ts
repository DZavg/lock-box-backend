import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { CreateConfirmationCodeDto } from '../dto/create-confirmation-code.dto';

@Entity('confirmationCode')
export class ConfirmationCode {
  @Exclude()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  code: string;

  @Column({ unique: true })
  email: string;

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

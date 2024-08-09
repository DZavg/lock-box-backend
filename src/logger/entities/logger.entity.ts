import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('logger')
export class MyLogger {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column()
  status_code: number;

  @Column()
  user_agent: string;

  @Column()
  ip: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;
}

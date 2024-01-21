import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Session } from '../../sessions/entities/session.entity';
import Role from '../../roles/role.enum';

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

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  roles: Role[];

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

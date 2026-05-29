import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 100, nullable: true })
  openid?: string;

  @Column({ length: 100, nullable: true })
  unionid?: string;

  @Column({ length: 100, nullable: true })
  nickname?: string;

  @Column({ length: 500, nullable: true })
  avatar?: string;

  @Index()
  @Column({ length: 30, nullable: true })
  phone?: string;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({ default: 0 })
  gender: number;

  @Index()
  @Column({ default: 1 })
  status: number;

  @Column({ length: 255, nullable: true })
  bio?: string;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt?: Date;
}

import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50, nullable: true })
  nickname?: string;

  @Column({ length: 50, default: 'admin' })
  role: string;

  @Column({ default: 1 })
  status: number;
}

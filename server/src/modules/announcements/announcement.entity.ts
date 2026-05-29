import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('announcements')
export class Announcement extends BaseEntity {
  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Index()
  @Column({ length: 50, default: 'home_top' })
  position: string;

  @Column({ name: 'is_top', default: false })
  isTop: boolean;

  @Index()
  @Column({ default: 1 })
  status: number;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime?: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime?: Date;

  @Column({ default: 0 })
  sort: number;
}

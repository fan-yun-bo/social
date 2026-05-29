import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('ads')
export class Ad extends BaseEntity {
  @Index()
  @Column({ name: 'order_id', type: 'bigint', nullable: true })
  orderId?: string;

  @Index()
  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId?: string;

  @Column({ length: 100 })
  title: string;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Index()
  @Column({ name: 'position_id', type: 'bigint' })
  positionId: string;

  @Column({ name: 'link_type', length: 50, default: 'none' })
  linkType: string;

  @Column({ name: 'link_url', length: 500, nullable: true })
  linkUrl?: string;

  @Index()
  @Column({ default: 0 })
  status: number;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime?: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime?: Date;

  @Column({ default: 0 })
  sort: number;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'click_count', default: 0 })
  clickCount: number;

  @Column({ name: 'reject_reason', length: 255, nullable: true })
  rejectReason?: string;
}

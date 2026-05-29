import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('ad_logs')
export class AdLog extends BaseEntity {
  @Index()
  @Column({ name: 'ad_id', type: 'bigint' })
  adId: string;

  @Index()
  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId?: string;

  @Index()
  @Column({ name: 'event_type', length: 20 })
  eventType: 'view' | 'click';

  @Column({ length: 50, nullable: true })
  ip?: string;

  @Column({ name: 'user_agent', length: 500, nullable: true })
  userAgent?: string;
}

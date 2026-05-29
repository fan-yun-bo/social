import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('ad_orders')
export class AdOrder extends BaseEntity {
  @Index({ unique: true })
  @Column({ name: 'order_no', length: 64 })
  orderNo: string;

  @Index()
  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @Index()
  @Column({ name: 'position_id', type: 'bigint' })
  positionId: string;

  @Column({ name: 'package_id', type: 'bigint' })
  packageId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ name: 'pay_amount', type: 'decimal', precision: 10, scale: 2 })
  payAmount: string;

  @Index()
  @Column({ name: 'pay_status', default: 0 })
  payStatus: number;

  @Index()
  @Column({ name: 'order_status', default: 0 })
  orderStatus: number;

  @Column({ name: 'pay_time', type: 'datetime', nullable: true })
  payTime?: Date;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime?: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime?: Date;

  @Column({ name: 'reject_reason', length: 255, nullable: true })
  rejectReason?: string;
}

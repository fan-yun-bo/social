import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('ad_positions')
export class AdPosition extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 100 })
  code: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ name: 'max_count', default: 1 })
  maxCount: number;

  @Column({ name: 'price_per_day', type: 'decimal', precision: 10, scale: 2, default: 0 })
  pricePerDay: string;

  @Index()
  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  sort: number;
}

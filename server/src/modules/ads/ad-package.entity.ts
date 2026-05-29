import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { AdPosition } from './ad-position.entity';

@Entity('ad_packages')
export class AdPackage extends BaseEntity {
  @Index()
  @Column({ name: 'position_id', type: 'bigint' })
  positionId: string;

  @ManyToOne(() => AdPosition)
  @JoinColumn({ name: 'position_id' })
  position?: AdPosition;

  @Column({ length: 100 })
  name: string;

  @Column()
  days: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice?: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Index()
  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  sort: number;
}

import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('files')
export class FileEntity extends BaseEntity {
  @Index()
  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId?: string;

  @Column({ name: 'file_url', length: 500 })
  fileUrl: string;

  @Column({ name: 'file_path', length: 500, nullable: true })
  filePath?: string;

  @Column({ name: 'file_name', length: 255, nullable: true })
  fileName?: string;

  @Column({ name: 'original_name', length: 255, nullable: true })
  originalName?: string;

  @Index()
  @Column({ name: 'file_type', length: 50, default: 'image' })
  fileType: string;

  @Column({ name: 'mime_type', length: 100, nullable: true })
  mimeType?: string;

  @Column({ name: 'file_size', type: 'bigint', default: 0 })
  fileSize: number;

  @Column({ name: 'storage_type', length: 50, default: 'local' })
  storageType: string;

  @Index()
  @Column({ length: 50, nullable: true })
  scene?: string;

  @Column({ default: 1 })
  status: number;
}

import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('post_likes')
@Unique('uk_post_user', ['postId', 'userId'])
export class PostLike extends BaseEntity {
  @Index()
  @Column({ name: 'post_id', type: 'bigint' })
  postId: string;

  @Index()
  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;
}

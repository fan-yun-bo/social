import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Index()
  @Column({ name: 'post_id', type: 'bigint' })
  postId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post?: Post;

  @Index()
  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Index()
  @Column({ name: 'parent_id', type: 'bigint', default: 0 })
  parentId: string;

  @Column({ length: 1000 })
  content: string;

  @Index()
  @Column({ default: 1 })
  status: number;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdOrder } from '../ads/ad-order.entity';
import { Comment } from '../comments/comment.entity';
import { PostLike } from '../posts/post-like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(PostLike) private readonly likes: Repository<PostLike>,
    @InjectRepository(AdOrder) private readonly orders: Repository<AdOrder>,
  ) {}

  async overview() {
    const [users, posts, comments, likes, adOrders] = await Promise.all([
      this.users.count(),
      this.posts.count(),
      this.comments.count(),
      this.likes.count(),
      this.orders.count(),
    ]);
    return { users, posts, comments, likes, adOrders };
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdOrder } from '../ads/ad-order.entity';
import { Comment } from '../comments/comment.entity';
import { PostLike } from '../posts/post-like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment, PostLike, AdOrder])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

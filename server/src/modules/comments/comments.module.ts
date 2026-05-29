import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/post.entity';
import { Comment } from './comment.entity';
import { AdminCommentsController, CommentsController, MyCommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentsController, MyCommentsController, AdminCommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

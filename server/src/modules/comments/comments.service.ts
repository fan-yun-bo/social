import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/comment.dto';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
  ) {}

  async list(postId: string) {
    return this.comments.find({ where: { postId, status: 1 }, relations: { user: true }, order: { createdAt: 'DESC' } });
  }

  async create(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.posts.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    const comment = await this.comments.save(this.comments.create({ postId, userId, content: dto.content, parentId: dto.parentId ?? '0' }));
    await this.posts.increment({ id: postId }, 'commentCount', 1);
    return comment;
  }

  async removeOwn(id: string, userId: string) {
    const comment = await this.comments.findOne({ where: { id, userId } });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.comments.update(id, { status: -1 });
    await this.posts.decrement({ id: comment.postId }, 'commentCount', 1);
    return { deleted: true };
  }

  async adminList() {
    return this.comments.find({ relations: { user: true, post: true }, order: { createdAt: 'DESC' } });
  }

  async setStatus(id: string, status: number) {
    await this.comments.update(id, { status });
    return this.comments.findOne({ where: { id } });
  }
}

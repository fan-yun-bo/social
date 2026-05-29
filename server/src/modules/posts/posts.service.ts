import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto, toPagination } from '../../common/dto/pagination.dto';
import { CreatePostDto } from './dto/post.dto';
import { PostLike } from './post-like.entity';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    @InjectRepository(PostLike) private readonly likes: Repository<PostLike>,
  ) {}

  create(userId: string, dto: CreatePostDto) {
    return this.posts.save(this.posts.create({ userId, content: dto.content, images: dto.images ?? [] }));
  }

  async list(query: PaginationDto, userId?: string) {
    const [list, total] = await this.posts.findAndCount({ where: { status: 1 }, relations: { user: true }, order: { isTop: 'DESC', createdAt: 'DESC' }, ...toPagination(query.page, query.pageSize) });
    const liked = userId ? await this.likes.find({ where: list.map((post) => ({ postId: post.id, userId })) }) : [];
    const likedIds = new Set(liked.map((like) => like.postId));
    return { list: list.map((post) => ({ ...post, isLiked: likedIds.has(post.id) })), total };
  }

  async detail(id: string) {
    const post = await this.posts.findOne({ where: { id }, relations: { user: true } });
    if (!post) throw new NotFoundException('Post not found');
    await this.posts.increment({ id }, 'viewCount', 1);
    return post;
  }

  async toggleLike(postId: string, userId: string) {
    await this.detail(postId);
    const exists = await this.likes.findOne({ where: { postId, userId } });
    if (exists) {
      await this.likes.delete(exists.id);
      await this.posts.decrement({ id: postId }, 'likeCount', 1);
      return { liked: false };
    }
    await this.likes.save(this.likes.create({ postId, userId }));
    await this.posts.increment({ id: postId }, 'likeCount', 1);
    return { liked: true };
  }

  async setStatus(id: string, status: number) {
    await this.posts.update(id, { status });
    return this.detail(id);
  }

  async setTop(id: string, isTop: boolean) {
    await this.posts.update(id, { isTop });
    return this.detail(id);
  }
}

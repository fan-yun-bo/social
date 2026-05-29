import { Body, Controller, Get, Param, Patch, Post as HttpPost, Query, UseGuards } from '@nestjs/common';
import { IsBoolean, IsInt } from 'class-validator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

class SetStatusDto { @IsInt() status: number; }
class SetTopDto { @IsBoolean() isTop: boolean; }

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  list(@Query() query: PaginationDto) { return this.postsService.list(query); }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreatePostDto) { return this.postsService.create(user.sub, dto); }

  @Get(':id')
  detail(@Param('id') id: string) { return this.postsService.detail(id); }

  @HttpPost(':id/like')
  @UseGuards(JwtAuthGuard)
  like(@Param('id') id: string, @CurrentUser() user: { sub: string }) { return this.postsService.toggleLike(id, user.sub); }
}

@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  list(@Query() query: PaginationDto) { return this.postsService.list(query); }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetStatusDto) { return this.postsService.setStatus(id, dto.status); }

  @Patch(':id/top')
  setTop(@Param('id') id: string, @Body() dto: SetTopDto) { return this.postsService.setTop(id, dto.isTop); }
}

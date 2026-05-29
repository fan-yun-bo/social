import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsInt } from 'class-validator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';

class SetCommentStatusDto { @IsInt() status: number; }

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  list(@Param('postId') postId: string) { return this.commentsService.list(postId); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Param('postId') postId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(postId, user.sub, dto);
  }
}

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class MyCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { sub: string }) { return this.commentsService.removeOwn(id, user.sub); }
}

@Controller('admin/comments')
@UseGuards(JwtAuthGuard)
export class AdminCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  list() { return this.commentsService.adminList(); }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetCommentStatusDto) { return this.commentsService.setStatus(id, dto.status); }
}

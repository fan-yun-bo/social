import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AnnouncementsService } from './announcements.service';
import { SaveAnnouncementDto } from './dto/announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Get()
  list(@Query('position') position?: string) { return this.service.publicList(position); }
}

@Controller('admin/announcements')
@UseGuards(JwtAuthGuard)
export class AdminAnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Get()
  list() { return this.service.adminList(); }

  @Post()
  create(@Body() dto: SaveAnnouncementDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: SaveAnnouncementDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}

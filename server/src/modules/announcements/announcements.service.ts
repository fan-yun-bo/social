import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveAnnouncementDto } from './dto/announcement.dto';
import { Announcement } from './announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(@InjectRepository(Announcement) private readonly announcements: Repository<Announcement>) {}

  publicList(position = 'home_top') {
    return this.announcements.find({ where: { position, status: 1 }, order: { isTop: 'DESC', sort: 'DESC', createdAt: 'DESC' } });
  }

  adminList() { return this.announcements.find({ order: { createdAt: 'DESC' } }); }

  create(dto: SaveAnnouncementDto) { return this.announcements.save(this.announcements.create(this.mapDto(dto))); }

  async update(id: string, dto: SaveAnnouncementDto) {
    await this.announcements.update(id, this.mapDto(dto));
    return this.announcements.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.announcements.delete(id);
    return { deleted: true };
  }

  private mapDto(dto: SaveAnnouncementDto) {
    return {
      ...dto,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
    };
  }
}

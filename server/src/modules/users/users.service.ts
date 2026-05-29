import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PaginationDto, toPagination } from '../../common/dto/pagination.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async findOrCreateFromWx(openid: string, nickname?: string, avatar?: string) {
    let user = await this.users.findOne({ where: { openid } });
    if (!user) {
      user = this.users.create({ openid, nickname, avatar });
    }
    user.nickname = nickname ?? user.nickname;
    user.avatar = avatar ?? user.avatar;
    user.lastLoginAt = new Date();
    return this.users.save(user);
  }

  async bindPhone(userId: string, phone: string) {
    await this.users.update(userId, { phone, phoneVerified: true });
    return this.findById(userId);
  }

  async updateProfile(userId: string, data: Pick<User, 'nickname' | 'avatar'>) {
    await this.users.update(userId, data);
    return this.findById(userId);
  }

  async findById(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async list(query: PaginationDto) {
    const where = query.keyword ? [{ nickname: Like(`%${query.keyword}%`) }, { phone: Like(`%${query.keyword}%`) }] : undefined;
    const [list, total] = await this.users.findAndCount({ where, order: { createdAt: 'DESC' }, ...toPagination(query.page, query.pageSize) });
    return { list, total };
  }

  async setStatus(id: string, status: number) {
    await this.users.update(id, { status });
    return this.findById(id);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { UsersService } from '../users/users.service';
import { AdminLoginDto, WxLoginDto, WxPhoneDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(Admin) private readonly admins: Repository<Admin>,
  ) {}

  async wxLogin(dto: WxLoginDto) {
    const openid = `dev-${dto.code}`;
    const user = await this.usersService.findOrCreateFromWx(openid, dto.nickname, dto.avatar);
    return { token: this.sign(user.id, 'user'), user };
  }

  async bindWxPhone(userId: string, dto: WxPhoneDto) {
    const phone = dto.phone ?? dto.code;
    const user = await this.usersService.bindPhone(userId, phone);
    return { phone: user.phone, phoneVerified: user.phoneVerified };
  }

  async adminLogin(dto: AdminLoginDto) {
    let admin = await this.admins.findOne({ where: { username: dto.username } });
    if (!admin && dto.username === 'admin') {
      admin = await this.admins.save(this.admins.create({ username: 'admin', password: await hash('admin123', 10), nickname: '超级管理员' }));
    }
    if (!admin || admin.status !== 1 || !(await compare(dto.password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { token: this.sign(admin.id, 'admin'), admin: { id: admin.id, username: admin.username, nickname: admin.nickname } };
  }

  private sign(sub: string, role: 'user' | 'admin') {
    return this.jwtService.sign({ sub, role });
  }
}

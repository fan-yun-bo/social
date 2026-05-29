import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  profile(@CurrentUser() user: { sub: string }) {
    return this.usersService.findById(user.sub);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: { sub: string }, @Body() body: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, body);
  }
}

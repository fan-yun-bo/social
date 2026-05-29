import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { IsInt } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

class SetUserStatusDto { @IsInt() status: number; }

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@Query() query: PaginationDto) { return this.usersService.list(query); }

  @Get(':id')
  detail(@Param('id') id: string) { return this.usersService.findById(id); }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: SetUserStatusDto) { return this.usersService.setStatus(id, dto.status); }
}

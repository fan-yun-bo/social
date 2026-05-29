import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AdminLoginDto, WxLoginDto, WxPhoneDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wx-login')
  wxLogin(@Body() dto: WxLoginDto) {
    return this.authService.wxLogin(dto);
  }

  @Post('wx-phone')
  @UseGuards(JwtAuthGuard)
  bindWxPhone(@CurrentUser() user: { sub: string }, @Body() dto: WxPhoneDto) {
    return this.authService.bindWxPhone(user.sub, dto);
  }
}

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }
}

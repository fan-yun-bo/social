import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdsService } from './ads.service';
import { CreateAdOrderDto, RejectAdDto } from './dto/ad.dto';

@Controller()
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('ad-positions')
  positions() { return this.adsService.positionsList(); }

  @Get('ad-packages')
  packages(@Query('positionId') positionId?: string) { return this.adsService.packagesList(positionId); }

  @Get('ads')
  ads(@Query('positionId') positionId?: string) { return this.adsService.listActive(positionId); }

  @Post('ads/:id/view')
  view(@Param('id') id: string) { return this.adsService.log(id, 'view'); }

  @Post('ads/:id/click')
  click(@Param('id') id: string) { return this.adsService.log(id, 'click'); }

  @Post('ad-orders')
  @UseGuards(JwtAuthGuard)
  createOrder(@CurrentUser() user: { sub: string }, @Body() dto: CreateAdOrderDto) { return this.adsService.createOrder(user.sub, dto); }

  @Get('my/ad-orders')
  @UseGuards(JwtAuthGuard)
  myOrders(@CurrentUser() user: { sub: string }) { return this.adsService.myOrders(user.sub); }

  @Get('my/ad-orders/:id')
  @UseGuards(JwtAuthGuard)
  myOrderDetail(@CurrentUser() user: { sub: string }, @Param('id') id: string) { return this.adsService.myOrderDetail(user.sub, id); }
}

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminAdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('ad-positions')
  positions() { return this.adsService.adminPositions(); }

  @Get('ad-packages')
  packages() { return this.adsService.adminPackages(); }

  @Get('ad-orders')
  orders() { return this.adsService.adminOrders(); }

  @Patch('ads/:id/approve')
  approve(@Param('id') id: string) { return this.adsService.approveAd(id); }

  @Patch('ads/:id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectAdDto) { return this.adsService.rejectAd(id, dto); }
}

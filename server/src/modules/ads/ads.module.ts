import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdLog } from './ad-log.entity';
import { AdOrder } from './ad-order.entity';
import { AdPackage } from './ad-package.entity';
import { AdPosition } from './ad-position.entity';
import { Ad } from './ad.entity';
import { AdminAdsController, AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdPosition, AdPackage, AdOrder, Ad, AdLog])],
  controllers: [AdsController, AdminAdsController],
  providers: [AdsService],
  exports: [AdsService, TypeOrmModule],
})
export class AdsModule {}

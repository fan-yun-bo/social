import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { StatisticsService } from './statistics.service';

@Controller('admin/statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get()
  overview() { return this.service.overview(); }
}

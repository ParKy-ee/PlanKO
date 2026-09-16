import { Controller, Get, Query } from '@nestjs/common';
import { HomeDashboardService } from './home-dashboard.service';
import { ResponseHelper } from '../../commons/helpers/response.helper';

@Controller({
  path: 'home-dashboard',
  version: '1',
})
export class HomeDashboardController {
  constructor(private readonly homeDashboardService: HomeDashboardService) { }

  @Get()
  async getDashboard(@Query('userId') userId: string) {
    if (!userId || isNaN(+userId)) {
      return ResponseHelper.error('Valid userId is required as query parameter');
    }
    const data = await this.homeDashboardService.getDashboardData(+userId);
    return ResponseHelper.success(data);
  }
}

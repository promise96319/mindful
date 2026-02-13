import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { CurrentUser } from '../common/decorators';
import { ViewMode } from './aggregation.service';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('heatmap')
  async getHeatmap(
    @CurrentUser('sub') userId: string,
    @Query('year') year?: string,
    @Query('viewMode') viewMode?: ViewMode,
  ) {
    // Default to current year
    const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      throw new BadRequestException('Invalid year parameter');
    }

    // Default view mode is duration
    const mode: ViewMode = viewMode || 'duration';
    if (!['duration', 'sessions', 'mood'].includes(mode)) {
      throw new BadRequestException(
        'Invalid viewMode. Must be duration, sessions, or mood',
      );
    }

    const data = await this.statsService.getHeatmapData(userId, yearNum, mode);

    return {
      year: yearNum,
      viewMode: mode,
      data,
    };
  }

  @Get('emotion-calendar')
  async getEmotionCalendar(
    @CurrentUser('sub') userId: string,
    @Query('month') month?: string,
  ) {
    // Default to current month
    const currentDate = new Date();
    const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthStr = month || defaultMonth;

    // Validate month format (YYYY-MM)
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(monthStr)) {
      throw new BadRequestException('Invalid month format. Use YYYY-MM');
    }

    const data = await this.statsService.getEmotionCalendarData(
      userId,
      monthStr,
    );

    return {
      month: monthStr,
      data,
    };
  }

  @Get('overview')
  async getOverview(@CurrentUser('sub') userId: string) {
    const stats = await this.statsService.getOverview(userId);
    return stats;
  }
}

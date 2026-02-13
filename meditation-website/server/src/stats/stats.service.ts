import { Injectable } from '@nestjs/common';
import {
  AggregationService,
  ViewMode,
  HeatmapDataPoint,
  EmotionCalendarDataPoint,
  OverviewStats,
} from './aggregation.service';

@Injectable()
export class StatsService {
  constructor(private aggregationService: AggregationService) {}

  async getHeatmapData(
    userId: string,
    year: number,
    viewMode: ViewMode,
  ): Promise<HeatmapDataPoint[]> {
    return this.aggregationService.getHeatmapData(userId, year, viewMode);
  }

  async getEmotionCalendarData(
    userId: string,
    month: string,
  ): Promise<EmotionCalendarDataPoint[]> {
    return this.aggregationService.getEmotionCalendarData(userId, month);
  }

  async getOverview(userId: string): Promise<OverviewStats> {
    return this.aggregationService.getOverview(userId);
  }
}

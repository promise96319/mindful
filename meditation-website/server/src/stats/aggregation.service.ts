import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PracticeRecord,
  PracticeRecordDocument,
} from '../practice-records/schemas/practice-record.schema';
import { Journal, JournalDocument } from '../journals/schemas/journal.schema';

export type ViewMode = 'duration' | 'sessions' | 'mood';

export interface HeatmapDataPoint {
  date: string;
  value: number;
  sessionCount?: number;
}

export interface EmotionCalendarDataPoint {
  date: string;
  mood: number;
  focus: number;
  journalId: string;
}

export interface OverviewStats {
  totalPracticeDays: number;
  totalPracticeSeconds: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  averageFocus: number;
  totalJournals: number;
  favoriteTools: Array<{ tool: string; count: number; duration: number }>;
}

@Injectable()
export class AggregationService {
  constructor(
    @InjectModel(PracticeRecord.name)
    private recordModel: Model<PracticeRecordDocument>,
    @InjectModel(Journal.name)
    private journalModel: Model<JournalDocument>,
  ) {}

  /**
   * Get heatmap data for practice records
   * @param userId User ID
   * @param year Year to fetch data for (e.g., 2026)
   * @param viewMode What metric to aggregate: duration, sessions, or mood
   * @returns Array of data points with date and value
   */
  async getHeatmapData(
    userId: string,
    year: number,
    viewMode: ViewMode = 'duration',
  ): Promise<HeatmapDataPoint[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    if (viewMode === 'mood') {
      // For mood view, aggregate journal mood data
      const result = await this.journalModel
        .aggregate([
          {
            $match: {
              userId: new Types.ObjectId(userId),
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: '$date',
              averageMood: { $avg: '$mood' },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              value: { $round: ['$averageMood', 1] },
              sessionCount: '$count',
            },
          },
          {
            $sort: { date: 1 },
          },
        ])
        .exec();

      return result;
    }

    // For duration and sessions views, aggregate practice records
    const groupByField =
      viewMode === 'duration' ? { $sum: '$duration' } : { $sum: 1 };

    const result = await this.recordModel
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$date',
            value: groupByField,
            sessionCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            value: 1,
            sessionCount: 1,
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .exec();

    return result;
  }

  /**
   * Get emotion calendar data for journals
   * @param userId User ID
   * @param month Month in YYYY-MM format
   * @returns Array of emotion data points with date, mood, focus
   */
  async getEmotionCalendarData(
    userId: string,
    month: string,
  ): Promise<EmotionCalendarDataPoint[]> {
    // Parse month to get start and end dates
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;

    // Calculate end date (last day of month)
    const nextMonth = new Date(parseInt(year), parseInt(monthNum), 1);
    const lastDay = new Date(nextMonth.getTime() - 1);
    const endDate = lastDay.toISOString().split('T')[0];

    const result = await this.journalModel
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$date',
            mood: { $avg: '$mood' },
            focus: { $avg: '$focus' },
            journalId: { $first: '$_id' },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            mood: { $round: ['$mood', 1] },
            focus: { $round: ['$focus', 1] },
            journalId: { $toString: '$journalId' },
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .exec();

    return result;
  }

  /**
   * Get overview statistics for a user
   * @param userId User ID
   * @returns Overview statistics
   */
  async getOverview(userId: string): Promise<OverviewStats> {
    const userObjectId = new Types.ObjectId(userId);

    // Get practice records stats
    const [practiceStats] = await this.recordModel
      .aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalPracticeSeconds: { $sum: '$duration' },
            uniqueDates: { $addToSet: '$date' },
          },
        },
      ])
      .exec();

    // Get journal stats
    const [journalStats] = await this.journalModel
      .aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalJournals: { $sum: 1 },
            averageMood: { $avg: '$mood' },
            averageFocus: { $avg: '$focus' },
          },
        },
      ])
      .exec();

    // Get favorite tools
    const favoriteTools = await this.recordModel
      .aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: '$tool',
            count: { $sum: 1 },
            duration: { $sum: '$duration' },
          },
        },
        {
          $project: {
            _id: 0,
            tool: '$_id',
            count: 1,
            duration: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .exec();

    // Calculate streaks
    const allRecords = await this.recordModel
      .find({ userId: userObjectId })
      .select('date')
      .sort({ date: -1 })
      .exec();

    const uniqueDates = [
      ...new Set(allRecords.map((r) => r.date)),
    ].sort();

    const { currentStreak, longestStreak } = this.calculateStreaks(uniqueDates);

    return {
      totalPracticeDays: practiceStats?.uniqueDates?.length || 0,
      totalPracticeSeconds: practiceStats?.totalPracticeSeconds || 0,
      totalSessions: practiceStats?.totalSessions || 0,
      currentStreak,
      longestStreak,
      averageMood: journalStats?.averageMood
        ? Math.round(journalStats.averageMood * 10) / 10
        : 0,
      averageFocus: journalStats?.averageFocus
        ? Math.round(journalStats.averageFocus * 10) / 10
        : 0,
      totalJournals: journalStats?.totalJournals || 0,
      favoriteTools,
    };
  }

  /**
   * Calculate current streak and longest streak from sorted dates
   */
  private calculateStreaks(sortedDates: string[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    // Check if current streak is active
    if (
      sortedDates[sortedDates.length - 1] === today ||
      sortedDates[sortedDates.length - 1] === yesterday
    ) {
      currentStreak = 1;
    }

    // Calculate streaks
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffDays = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / 86400000,
      );

      if (diffDays === 1) {
        tempStreak++;
        if (i === sortedDates.length - 1 || currentStreak > 0) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (currentStreak > 0 && i < sortedDates.length - 1) {
          currentStreak = 0;
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }
}

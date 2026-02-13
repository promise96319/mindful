import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AggregationService } from './aggregation.service';
import {
  PracticeRecord,
  PracticeRecordSchema,
} from '../practice-records/schemas/practice-record.schema';
import {
  Journal,
  JournalSchema,
} from '../journals/schemas/journal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PracticeRecord.name, schema: PracticeRecordSchema },
      { name: Journal.name, schema: JournalSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService, AggregationService],
  exports: [StatsService, AggregationService],
})
export class StatsModule {}

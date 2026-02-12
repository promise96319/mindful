import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PracticeRecord,
  PracticeRecordSchema,
} from './schemas/practice-record.schema';
import { PracticeRecordsService } from './practice-records.service';
import { PracticeRecordsController } from './practice-records.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PracticeRecord.name, schema: PracticeRecordSchema },
    ]),
    UsersModule,
  ],
  controllers: [PracticeRecordsController],
  providers: [PracticeRecordsService],
})
export class PracticeRecordsModule {}

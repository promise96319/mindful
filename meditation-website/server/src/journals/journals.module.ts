import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from './schemas/journal.schema';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
  ],
  controllers: [JournalsController],
  providers: [JournalsService],
})
export class JournalsModule {}

import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PracticeRecordsService } from './practice-records.service';
import { CreatePracticeRecordDto } from './dto';
import { CurrentUser } from '../common/decorators';

@Controller('api/practice-records')
export class PracticeRecordsController {
  constructor(
    private readonly practiceRecordsService: PracticeRecordsService,
  ) {}

  @Post()
  async create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreatePracticeRecordDto,
  ) {
    const record = await this.practiceRecordsService.create(userId, dto);
    return this.practiceRecordsService.toResponse(record);
  }

  @Get()
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const records = await this.practiceRecordsService.findAllByUser(
      userId,
      startDate,
      endDate,
    );
    return records.map((r) => this.practiceRecordsService.toResponse(r));
  }
}

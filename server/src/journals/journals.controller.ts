import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto, UpdateJournalDto } from './dto';
import { CurrentUser, Public } from '../common/decorators';

@Controller('api/journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Post()
  async create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateJournalDto,
  ) {
    const journal = await this.journalsService.create(userId, dto);
    return this.journalsService.toResponse(journal);
  }

  @Get()
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const journals = await this.journalsService.findAllByUser(
      userId,
      limit ? parseInt(limit, 10) : 50,
    );
    return journals.map((j) => this.journalsService.toResponse(j));
  }

  @Public()
  @Get('public')
  async findPublic(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const journals = await this.journalsService.findPublicJournals(
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return journals.map((j) => this.journalsService.toResponse(j));
  }

  @Get(':id')
  async findOne(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    const journal = await this.journalsService.findOne(userId, id);
    return this.journalsService.toResponse(journal);
  }

  @Patch(':id')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateJournalDto,
  ) {
    const journal = await this.journalsService.update(userId, id, dto);
    return this.journalsService.toResponse(journal);
  }

  @Delete(':id')
  async remove(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    await this.journalsService.remove(userId, id);
    return { deleted: true };
  }
}

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
import { CreateJournalDto, UpdateJournalDto, UpdateVisibilityDto } from './dto';
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

  @Public()
  @Get('public/feed')
  async getPublicFeed(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: 'latest' | 'popular',
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const sortBy = sort || 'latest';

    const { journals, total } = await this.journalsService.getPublicJournals(
      pageNum,
      limitNum,
      sortBy,
      search,
    );

    return {
      journals: journals.map((j) => this.journalsService.toResponse(j)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get('following/feed')
  async getFollowingFeed(
    @CurrentUser('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: Get following IDs from a FollowService
    // For now, return empty array - this will need to be implemented with the social module
    const followingIds: string[] = [];

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    const { journals, total } =
      await this.journalsService.getFollowingJournals(
        userId,
        followingIds,
        pageNum,
        limitNum,
      );

    return {
      journals: journals.map((j) => this.journalsService.toResponse(j)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Patch(':id/visibility')
  async updateVisibility(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVisibilityDto,
  ) {
    const journal = await this.journalsService.updateVisibility(
      userId,
      id,
      dto,
    );
    return this.journalsService.toResponse(journal);
  }
}

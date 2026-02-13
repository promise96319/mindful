import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LikeService } from '../services/like.service';
import { CurrentUser } from '../../common/decorators';

@Controller('api/social/likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /**
   * Like a journal
   * POST /api/social/likes/journal/:journalId
   */
  @Post('journal/:journalId')
  async like(
    @CurrentUser('userId') userId: string,
    @Param('journalId') journalId: string,
  ) {
    const like = await this.likeService.like(userId, journalId);
    return {
      success: true,
      data: {
        userId: like.userId,
        journalId: like.journalId,
        createdAt: like.createdAt,
      },
    };
  }

  /**
   * Unlike a journal
   * DELETE /api/social/likes/journal/:journalId
   */
  @Delete('journal/:journalId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlike(
    @CurrentUser('userId') userId: string,
    @Param('journalId') journalId: string,
  ) {
    await this.likeService.unlike(userId, journalId);
  }

  /**
   * Get users who liked a journal
   * GET /api/social/likes/journal/:journalId/likers
   */
  @Get('journal/:journalId/likers')
  async getLikers(
    @Param('journalId') journalId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const likers = await this.likeService.getLikers(
      journalId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: likers,
    };
  }

  /**
   * Get journals liked by current user
   * GET /api/social/likes/user/liked
   */
  @Get('user/liked')
  async getLikedJournals(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const journals = await this.likeService.getLikedJournals(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: journals,
    };
  }

  /**
   * Get journals liked by a specific user
   * GET /api/social/likes/user/:userId/liked
   */
  @Get('user/:userId/liked')
  async getUserLikedJournals(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const journals = await this.likeService.getLikedJournals(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: journals,
    };
  }

  /**
   * Check if current user has liked a journal
   * GET /api/social/likes/journal/:journalId/status
   */
  @Get('journal/:journalId/status')
  async getLikeStatus(
    @CurrentUser('userId') userId: string,
    @Param('journalId') journalId: string,
  ) {
    const hasLiked = await this.likeService.hasLiked(userId, journalId);
    return {
      success: true,
      data: { hasLiked },
    };
  }
}

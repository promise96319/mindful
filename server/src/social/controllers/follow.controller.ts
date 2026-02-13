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
import { FollowService } from '../services/follow.service';
import { CurrentUser } from '../../common/decorators';

@Controller('api/social/follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  /**
   * Follow a user
   * POST /api/social/follow/:userId
   */
  @Post(':userId')
  async follow(
    @CurrentUser('userId') currentUserId: string,
    @Param('userId') targetUserId: string,
  ) {
    const follow = await this.followService.follow(currentUserId, targetUserId);
    return {
      success: true,
      data: {
        followerId: follow.followerId,
        followingId: follow.followingId,
        createdAt: follow.createdAt,
      },
    };
  }

  /**
   * Unfollow a user
   * DELETE /api/social/follow/:userId
   */
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @CurrentUser('userId') currentUserId: string,
    @Param('userId') targetUserId: string,
  ) {
    await this.followService.unfollow(currentUserId, targetUserId);
  }

  /**
   * Get users that current user is following
   * GET /api/social/follow/following
   */
  @Get('following')
  async getFollowing(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const following = await this.followService.getFollowing(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: following,
    };
  }

  /**
   * Get users following the current user
   * GET /api/social/follow/followers
   */
  @Get('followers')
  async getFollowers(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const followers = await this.followService.getFollowers(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: followers,
    };
  }

  /**
   * Get users that a specific user is following
   * GET /api/social/follow/:userId/following
   */
  @Get(':userId/following')
  async getUserFollowing(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const following = await this.followService.getFollowing(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: following,
    };
  }

  /**
   * Get followers of a specific user
   * GET /api/social/follow/:userId/followers
   */
  @Get(':userId/followers')
  async getUserFollowers(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const followers = await this.followService.getFollowers(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: followers,
    };
  }

  /**
   * Check if current user is following another user
   * GET /api/social/follow/:userId/status
   */
  @Get(':userId/status')
  async getFollowStatus(
    @CurrentUser('userId') currentUserId: string,
    @Param('userId') targetUserId: string,
  ) {
    const isFollowing = await this.followService.isFollowing(
      currentUserId,
      targetUserId,
    );
    return {
      success: true,
      data: { isFollowing },
    };
  }
}

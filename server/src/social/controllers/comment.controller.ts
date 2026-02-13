import {
  Controller,
  Post,
  Delete,
  Patch,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CurrentUser } from '../../common/decorators';

class CreateCommentDto {
  content: string;
}

class UpdateCommentDto {
  content: string;
}

@Controller('api/social/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Create a comment on a journal
   * POST /api/social/comments/journal/:journalId
   */
  @Post('journal/:journalId')
  async create(
    @CurrentUser('userId') userId: string,
    @Param('journalId') journalId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.commentService.create(
      userId,
      journalId,
      dto.content,
    );

    // Fetch the comment with populated user info
    const populatedComment = await this.commentService.getById(comment._id.toString());

    return {
      success: true,
      data: this.commentService.toResponse(populatedComment),
    };
  }

  /**
   * Update a comment
   * PATCH /api/social/comments/:commentId
   */
  @Patch(':commentId')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    const comment = await this.commentService.update(
      commentId,
      userId,
      dto.content,
    );
    return {
      success: true,
      data: comment,
    };
  }

  /**
   * Delete a comment
   * DELETE /api/social/comments/:commentId
   */
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser('userId') userId: string,
    @Param('commentId') commentId: string,
  ) {
    await this.commentService.delete(commentId, userId);
  }

  /**
   * Get comments for a journal
   * GET /api/social/comments/journal/:journalId
   */
  @Get('journal/:journalId')
  async getByJournal(
    @Param('journalId') journalId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const comments = await this.commentService.getByJournal(
      journalId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: comments.map(c => this.commentService.toResponse(c)),
    };
  }

  /**
   * Get comments by current user
   * GET /api/social/comments/user
   */
  @Get('user')
  async getByCurrentUser(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const comments = await this.commentService.getByUser(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: comments,
    };
  }

  /**
   * Get comments by a specific user
   * GET /api/social/comments/user/:userId
   */
  @Get('user/:userId')
  async getByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const comments = await this.commentService.getByUser(
      userId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
    return {
      success: true,
      data: comments,
    };
  }
}

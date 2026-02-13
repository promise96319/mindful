import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { Journal, JournalDocument } from '../../journals/schemas/journal.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
  ) {}

  /**
   * Create a comment on a journal
   */
  async create(
    userId: string,
    journalId: string,
    content: string,
  ): Promise<Comment> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(journalId)) {
      throw new BadRequestException('Invalid ID');
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Comment content cannot be empty');
    }

    if (content.length > 500) {
      throw new BadRequestException('Comment content exceeds 500 characters');
    }

    // Check if journal exists and is public
    const journal = await this.journalModel.findById(journalId);
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    if (!journal.isPublic) {
      throw new ForbiddenException('Cannot comment on a private journal');
    }

    // Create comment
    const comment = new this.commentModel({
      journalId: new Types.ObjectId(journalId),
      userId: new Types.ObjectId(userId),
      content: content.trim(),
    });

    // Use atomic operation to increment comment count
    await Promise.all([
      comment.save(),
      this.journalModel.updateOne(
        { _id: journalId },
        { $inc: { commentCount: 1 } },
      ),
    ]);

    return comment;
  }

  /**
   * Delete a comment
   */
  async delete(commentId: string, userId: string): Promise<void> {
    // Validate IDs
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID');
    }

    // Find the comment
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== userId) {
      throw new UnauthorizedException('Cannot delete another user\'s comment');
    }

    // Delete comment and decrement count
    await Promise.all([
      this.commentModel.deleteOne({ _id: commentId }),
      this.journalModel.updateOne(
        { _id: comment.journalId },
        { $inc: { commentCount: -1 } },
      ),
    ]);
  }

  /**
   * Get comments for a journal
   */
  async getByJournal(
    journalId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Comment[]> {
    if (!Types.ObjectId.isValid(journalId)) {
      throw new BadRequestException('Invalid journal ID');
    }

    // Check if journal exists and is public
    const journal = await this.journalModel.findById(journalId);
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    if (!journal.isPublic) {
      throw new ForbiddenException('Cannot view comments on a private journal');
    }

    return this.commentModel
      .find({ journalId: new Types.ObjectId(journalId) })
      .skip(offset)
      .limit(limit)
      .populate('userId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Get comments by a user
   */
  async getByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Comment[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.commentModel
      .find({ userId: new Types.ObjectId(userId) })
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'journalId',
        select: 'date toolUsed duration mood focus freeText isPublic isAnonymous likeCount commentCount',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Update a comment
   */
  async update(
    commentId: string,
    userId: string,
    content: string,
  ): Promise<Comment> {
    // Validate IDs
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ID');
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Comment content cannot be empty');
    }

    if (content.length > 500) {
      throw new BadRequestException('Comment content exceeds 500 characters');
    }

    // Find the comment
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== userId) {
      throw new UnauthorizedException('Cannot update another user\'s comment');
    }

    // Update comment
    comment.content = content.trim();
    return comment.save();
  }
}

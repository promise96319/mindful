import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from '../schemas/like.schema';
import { Journal, JournalDocument } from '../../journals/schemas/journal.schema';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
  ) {}

  /**
   * Like a journal
   */
  async like(userId: string, journalId: string): Promise<Like> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(journalId)) {
      throw new BadRequestException('Invalid ID');
    }

    // Check if journal exists and is public
    const journal = await this.journalModel.findById(journalId);
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    if (!journal.isPublic) {
      throw new ForbiddenException('Cannot like a private journal');
    }

    // Check if already liked
    const existingLike = await this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    if (existingLike) {
      throw new ConflictException('Already liked this journal');
    }

    // Create like
    const like = new this.likeModel({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    // Use atomic operation to increment like count
    await Promise.all([
      like.save(),
      this.journalModel.updateOne(
        { _id: journalId },
        { $inc: { likeCount: 1 } },
      ),
    ]);

    return like;
  }

  /**
   * Unlike a journal
   */
  async unlike(userId: string, journalId: string): Promise<void> {
    // Validate IDs
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(journalId)) {
      throw new BadRequestException('Invalid ID');
    }

    // Find and delete the like
    const result = await this.likeModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    if (!result) {
      throw new NotFoundException('Like not found');
    }

    // Use atomic operation to decrement like count
    await this.journalModel.updateOne(
      { _id: journalId },
      { $inc: { likeCount: -1 } },
    );
  }

  /**
   * Get users who liked a journal
   */
  async getLikers(
    journalId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<any[]> {
    if (!Types.ObjectId.isValid(journalId)) {
      throw new BadRequestException('Invalid journal ID');
    }

    // Check if journal exists and is public
    const journal = await this.journalModel.findById(journalId);
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    if (!journal.isPublic) {
      throw new ForbiddenException('Cannot view likes on a private journal');
    }

    const likes = await this.likeModel
      .find({ journalId: new Types.ObjectId(journalId) })
      .skip(offset)
      .limit(limit)
      .populate('userId', 'displayName avatar bio')
      .sort({ createdAt: -1 })
      .exec();

    return likes.map((like) => ({
      user: like.userId,
      likedAt: like.createdAt,
    }));
  }

  /**
   * Get journals liked by a user
   */
  async getLikedJournals(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<any[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const likes = await this.likeModel
      .find({ userId: new Types.ObjectId(userId) })
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'journalId',
        select: 'date toolUsed duration mood focus freeText isPublic isAnonymous likeCount commentCount userId',
        populate: {
          path: 'userId',
          select: 'displayName avatar',
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    return likes.map((like) => ({
      journal: like.journalId,
      likedAt: like.createdAt,
    }));
  }

  /**
   * Check if user has liked a journal
   */
  async hasLiked(userId: string, journalId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(journalId)) {
      throw new BadRequestException('Invalid ID');
    }

    const like = await this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    return !!like;
  }
}

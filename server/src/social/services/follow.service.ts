import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow, FollowDocument } from '../schemas/follow.schema';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Follow a user
   */
  async follow(followerId: string, followingId: string): Promise<Follow> {
    // Validate user IDs
    if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
      throw new BadRequestException('Invalid user ID');
    }

    // Cannot follow yourself
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Check if both users exist
    const [follower, following] = await Promise.all([
      this.userModel.findById(followerId),
      this.userModel.findById(followingId),
    ]);

    if (!follower || !following) {
      throw new NotFoundException('User not found');
    }

    // Check if already following
    const existingFollow = await this.followModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    // Create follow relationship
    const follow = new this.followModel({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    // Use atomic operations to update counts
    await Promise.all([
      follow.save(),
      this.userModel.updateOne(
        { _id: followerId },
        { $inc: { 'stats.followingCount': 1 } },
      ),
      this.userModel.updateOne(
        { _id: followingId },
        { $inc: { 'stats.followerCount': 1 } },
      ),
    ]);

    return follow;
  }

  /**
   * Unfollow a user
   */
  async unfollow(followerId: string, followingId: string): Promise<void> {
    // Validate user IDs
    if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
      throw new BadRequestException('Invalid user ID');
    }

    // Find and delete the follow relationship
    const result = await this.followModel.findOneAndDelete({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (!result) {
      throw new NotFoundException('Follow relationship not found');
    }

    // Use atomic operations to update counts
    await Promise.all([
      this.userModel.updateOne(
        { _id: followerId },
        { $inc: { 'stats.followingCount': -1 } },
      ),
      this.userModel.updateOne(
        { _id: followingId },
        { $inc: { 'stats.followerCount': -1 } },
      ),
    ]);
  }

  /**
   * Get list of users that a user is following
   */
  async getFollowing(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<User[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const follows = await this.followModel
      .find({ followerId: new Types.ObjectId(userId) })
      .skip(offset)
      .limit(limit)
      .populate('followingId', 'displayName avatar bio stats')
      .exec();

    return follows.map((follow) => follow.followingId as unknown as User);
  }

  /**
   * Get list of users following a user
   */
  async getFollowers(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<User[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const follows = await this.followModel
      .find({ followingId: new Types.ObjectId(userId) })
      .skip(offset)
      .limit(limit)
      .populate('followerId', 'displayName avatar bio stats')
      .exec();

    return follows.map((follow) => follow.followerId as unknown as User);
  }

  /**
   * Check if user A is following user B
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const follow = await this.followModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    return !!follow;
  }
}

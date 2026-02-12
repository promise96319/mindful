import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByGithubId(githubId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }

  async updateSettings(
    userId: string,
    settings: Record<string, unknown>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { settings }, { new: true })
      .exec();
  }

  async incrementPracticeSeconds(
    userId: string,
    seconds: number,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $inc: { totalPracticeSeconds: seconds },
      })
      .exec();
  }

  async findOrCreateOAuthUser(profile: {
    provider: 'google' | 'github';
    providerId: string;
    email: string;
    displayName: string;
    photoURL: string;
  }): Promise<UserDocument> {
    const idField =
      profile.provider === 'google' ? 'googleId' : 'githubId';

    // Try to find by provider ID
    let user = await this.userModel
      .findOne({ [idField]: profile.providerId })
      .exec();
    if (user) return user;

    // Try to find by email and link accounts
    if (profile.email) {
      user = await this.userModel.findOne({ email: profile.email }).exec();
      if (user) {
        user[idField] = profile.providerId;
        if (!user.photoURL && profile.photoURL) {
          user.photoURL = profile.photoURL;
        }
        await user.save();
        return user;
      }
    }

    // Create new user
    return this.userModel.create({
      [idField]: profile.providerId,
      email: profile.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      totalPracticeSeconds: 0,
      settings: { theme: 'light', language: 'zh-CN' },
    });
  }

  toPublicUser(user: UserDocument) {
    const obj = user.toObject();
    return {
      id: (obj._id as Types.ObjectId).toString(),
      displayName: obj.displayName,
      email: obj.email,
      photoURL: obj.photoURL,
      totalPracticeSeconds: obj.totalPracticeSeconds,
      settings: obj.settings,
      createdAt: (obj as unknown as Record<string, unknown>).createdAt,
    };
  }
}

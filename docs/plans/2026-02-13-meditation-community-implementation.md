# Meditation Community Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a meditation-themed social platform with personal profiles, community feed, follow system, likes, comments, and advanced statistics visualization.

**Architecture:** Modular refactoring with clear separation between features (profile, community, stats, tools). Uses Zustand for state management, React Router v6 for routing, NestJS + MongoDB for backend. 4 parallel workstreams for efficient development.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS 4, Zustand, NestJS, MongoDB, Mongoose

---

## Overview of Workstreams

This plan is organized into 4 parallel workstreams that can be developed independently:

1. **Backend Foundation** (Days 1-2): Database schemas and core social APIs
2. **Stats Optimization** (Days 1-3): Improved heatmap, calendar, and charts
3. **Profile & Stats Pages** (Days 2-4): Personal profile and stats analysis pages
4. **Community Features** (Days 3-5): Community feed, comments, follow system
5. **Tools Fullscreen** (Days 4-5): Fullscreen tool experience

**Recommended Order:** Start with Backend Foundation, then parallelize the rest.

---

## Workstream 1: Backend Foundation

### Task 1: Install Zustand for State Management

**Files:**
- Modify: `meditation-website/package.json`

**Step 1: Install Zustand**

Run: `cd meditation-website && npm install zustand`

**Step 2: Verify installation**

Run: `npm list zustand`
Expected: `zustand@4.x.x` in output

**Step 3: Commit**

```bash
git add meditation-website/package.json meditation-website/package-lock.json
git commit -m "feat: add zustand for state management

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Extend User Schema with Social Fields

**Files:**
- Modify: `server/src/users/schemas/user.schema.ts`

**Step 1: Add avatar and bio fields to User schema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  displayName: string;

  @Prop()
  avatar?: string;

  @Prop({ maxlength: 500 })
  bio?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: Object, default: () => ({
    totalDuration: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    followingCount: 0,
    followerCount: 0
  })})
  stats: {
    totalDuration: number;
    totalSessions: number;
    currentStreak: number;
    longestStreak: number;
    followingCount: number;
    followerCount: number;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**Step 2: Commit**

```bash
git add server/src/users/schemas/user.schema.ts
git commit -m "feat(user): add avatar, bio, and social stats fields

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Extend Journal Schema with Social Fields

**Files:**
- Modify: `server/src/journals/schemas/journal.schema.ts`

**Step 1: Add social fields to Journal schema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JournalDocument = HydratedDocument<Journal>;

@Schema({ timestamps: true })
export class Journal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ default: '' })
  toolUsed: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true, min: 1, max: 5 })
  mood: number;

  @Prop({ required: true, min: 1, max: 5 })
  focus: number;

  @Prop({ type: [String], default: [] })
  bodyTags: string[];

  @Prop({ type: [String], default: [] })
  mindTags: string[];

  @Prop({ default: '' })
  freeText: string;

  @Prop({ default: false, index: true })
  isPublic: boolean;

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);

// Compound index for public journals sorted by creation time
JournalSchema.index({ isPublic: 1, createdAt: -1 });

// Text index for search
JournalSchema.index({ freeText: 'text' });
```

**Step 2: Commit**

```bash
git add server/src/journals/schemas/journal.schema.ts
git commit -m "feat(journal): add social fields and search indexes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create Follow Schema

**Files:**
- Create: `server/src/social/schemas/follow.schema.ts`

**Step 1: Create social directory**

Run: `mkdir -p server/src/social/schemas`

**Step 2: Create Follow schema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  followerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  followingId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Compound unique index to prevent duplicate follows
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Index for getting followers
FollowSchema.index({ followingId: 1, createdAt: -1 });

// Index for getting following
FollowSchema.index({ followerId: 1, createdAt: -1 });
```

**Step 3: Commit**

```bash
git add server/src/social/schemas/follow.schema.ts
git commit -m "feat(social): create Follow schema with indexes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Create Like Schema

**Files:**
- Create: `server/src/social/schemas/like.schema.ts`

**Step 1: Create Like schema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Journal', required: true, index: true })
  journalId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Compound unique index to prevent duplicate likes
LikeSchema.index({ userId: 1, journalId: 1 }, { unique: true });

// Index for getting likes by journal
LikeSchema.index({ journalId: 1, createdAt: -1 });
```

**Step 2: Commit**

```bash
git add server/src/social/schemas/like.schema.ts
git commit -m "feat(social): create Like schema with indexes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Create Comment Schema

**Files:**
- Create: `server/src/social/schemas/comment.schema.ts`

**Step 1: Create Comment schema**

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Journal', required: true, index: true })
  journalId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, maxlength: 500 })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Index for getting comments by journal, sorted by creation time
CommentSchema.index({ journalId: 1, createdAt: -1 });
```

**Step 2: Commit**

```bash
git add server/src/social/schemas/comment.schema.ts
git commit -m "feat(social): create Comment schema with indexes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Create Follow DTOs

**Files:**
- Create: `server/src/social/dto/index.ts`

**Step 1: Create DTOs directory and files**

Run: `mkdir -p server/src/social/dto`

**Step 2: Create index.ts with exports**

```typescript
// This file will export DTOs when created
export * from './create-comment.dto';
```

**Step 3: Create CreateCommentDto**

Create file: `server/src/social/dto/create-comment.dto.ts`

```typescript
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}
```

**Step 4: Commit**

```bash
git add server/src/social/dto/
git commit -m "feat(social): create comment DTOs

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Create FollowService

**Files:**
- Create: `server/src/social/services/follow.service.ts`

**Step 1: Create services directory**

Run: `mkdir -p server/src/social/services`

**Step 2: Create FollowService**

```typescript
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
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

  async follow(followerId: string, followingId: string) {
    // Prevent self-follow
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Check if already following
    const existing = await this.followModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (existing) {
      throw new ConflictException('Already following');
    }

    // Create follow relationship
    const follow = await this.followModel.create({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    // Update counts using atomic operations
    await Promise.all([
      this.userModel.updateOne(
        { _id: new Types.ObjectId(followerId) },
        { $inc: { 'stats.followingCount': 1 } },
      ),
      this.userModel.updateOne(
        { _id: new Types.ObjectId(followingId) },
        { $inc: { 'stats.followerCount': 1 } },
      ),
    ]);

    return follow;
  }

  async unfollow(followerId: string, followingId: string) {
    const result = await this.followModel.deleteOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Follow relationship not found');
    }

    // Update counts
    await Promise.all([
      this.userModel.updateOne(
        { _id: new Types.ObjectId(followerId) },
        { $inc: { 'stats.followingCount': -1 } },
      ),
      this.userModel.updateOne(
        { _id: new Types.ObjectId(followingId) },
        { $inc: { 'stats.followerCount': -1 } },
      ),
    ]);

    return { success: true };
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 20) {
    return this.followModel
      .find({ followerId: new Types.ObjectId(userId) })
      .populate('followingId', 'displayName avatar bio stats')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 20) {
    return this.followModel
      .find({ followingId: new Types.ObjectId(userId) })
      .populate('followerId', 'displayName avatar bio stats')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const count = await this.followModel.countDocuments({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });
    return count > 0;
  }
}
```

**Step 3: Commit**

```bash
git add server/src/social/services/follow.service.ts
git commit -m "feat(social): create FollowService with atomic count updates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Create LikeService

**Files:**
- Create: `server/src/social/services/like.service.ts`

**Step 1: Create LikeService**

```typescript
import {
  Injectable,
  ConflictException,
  NotFoundException,
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

  async like(userId: string, journalId: string) {
    // Check if already liked
    const existing = await this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    if (existing) {
      throw new ConflictException('Already liked');
    }

    // Create like
    const like = await this.likeModel.create({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    // Increment journal like count
    await this.journalModel.updateOne(
      { _id: new Types.ObjectId(journalId) },
      { $inc: { likeCount: 1 } },
    );

    return like;
  }

  async unlike(userId: string, journalId: string) {
    const result = await this.likeModel.deleteOne({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Like not found');
    }

    // Decrement journal like count
    await this.journalModel.updateOne(
      { _id: new Types.ObjectId(journalId) },
      { $inc: { likeCount: -1 } },
    );

    return { success: true };
  }

  async getLikes(journalId: string, page: number = 1, limit: number = 20) {
    return this.likeModel
      .find({ journalId: new Types.ObjectId(journalId) })
      .populate('userId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async isLiked(userId: string, journalId: string): Promise<boolean> {
    const count = await this.likeModel.countDocuments({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
    });
    return count > 0;
  }
}
```

**Step 2: Commit**

```bash
git add server/src/social/services/like.service.ts
git commit -m "feat(social): create LikeService with count updates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Create CommentService

**Files:**
- Create: `server/src/social/services/comment.service.ts`

**Step 1: Create CommentService**

```typescript
import {
  Injectable,
  NotFoundException,
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

  async create(userId: string, journalId: string, content: string) {
    // Verify journal exists
    const journal = await this.journalModel.findById(journalId);
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    // Create comment
    const comment = await this.commentModel.create({
      userId: new Types.ObjectId(userId),
      journalId: new Types.ObjectId(journalId),
      content,
    });

    // Increment comment count
    await this.journalModel.updateOne(
      { _id: new Types.ObjectId(journalId) },
      { $inc: { commentCount: 1 } },
    );

    // Populate user data before returning
    return this.commentModel
      .findById(comment._id)
      .populate('userId', 'displayName avatar')
      .lean();
  }

  async getComments(journalId: string, page: number = 1, limit: number = 20) {
    return this.commentModel
      .find({ journalId: new Types.ObjectId(journalId) })
      .populate('userId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check ownership
    if (comment.userId.toString() !== userId) {
      throw new UnauthorizedException('Can only delete your own comments');
    }

    await this.commentModel.deleteOne({ _id: new Types.ObjectId(commentId) });

    // Decrement comment count
    await this.journalModel.updateOne(
      { _id: comment.journalId },
      { $inc: { commentCount: -1 } },
    );

    return { success: true };
  }
}
```

**Step 2: Commit**

```bash
git add server/src/social/services/comment.service.ts
git commit -m "feat(social): create CommentService with count updates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Create Follow Controller

**Files:**
- Create: `server/src/social/controllers/follow.controller.ts`

**Step 1: Create controllers directory**

Run: `mkdir -p server/src/social/controllers`

**Step 2: Create FollowController**

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/schemas/user.schema';
import { FollowService } from '../services/follow.service';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('following')
  async getFollowing(
    @CurrentUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.followService.getFollowing(
      user._id.toString(),
      page || 1,
      limit || 20,
    );
  }

  @Get('followers')
  async getFollowers(
    @CurrentUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.followService.getFollowers(
      user._id.toString(),
      page || 1,
      limit || 20,
    );
  }

  @Post('follow/:userId')
  async followUser(
    @CurrentUser() user: User,
    @Param('userId') targetUserId: string,
  ) {
    return this.followService.follow(user._id.toString(), targetUserId);
  }

  @Delete('follow/:userId')
  async unfollowUser(
    @CurrentUser() user: User,
    @Param('userId') targetUserId: string,
  ) {
    return this.followService.unfollow(user._id.toString(), targetUserId);
  }

  @Get('follow/:userId/status')
  async checkFollowStatus(
    @CurrentUser() user: User,
    @Param('userId') targetUserId: string,
  ) {
    const isFollowing = await this.followService.isFollowing(
      user._id.toString(),
      targetUserId,
    );
    return { isFollowing };
  }
}
```

**Step 3: Commit**

```bash
git add server/src/social/controllers/follow.controller.ts
git commit -m "feat(social): create FollowController with all endpoints

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Create Like and Comment Controllers

**Files:**
- Create: `server/src/social/controllers/like.controller.ts`
- Create: `server/src/social/controllers/comment.controller.ts`

**Step 1: Create LikeController**

```typescript
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/schemas/user.schema';
import { LikeService } from '../services/like.service';

@Controller('journals/:journalId')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeJournal(
    @CurrentUser() user: User,
    @Param('journalId') journalId: string,
  ) {
    return this.likeService.like(user._id.toString(), journalId);
  }

  @Delete('like')
  @UseGuards(JwtAuthGuard)
  async unlikeJournal(
    @CurrentUser() user: User,
    @Param('journalId') journalId: string,
  ) {
    return this.likeService.unlike(user._id.toString(), journalId);
  }

  @Get('likes')
  async getLikes(
    @Param('journalId') journalId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.likeService.getLikes(journalId, page || 1, limit || 20);
  }
}
```

**Step 2: Create CommentController**

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/schemas/user.schema';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('journals/:journalId')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('comments')
  async getComments(
    @Param('journalId') journalId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.commentService.getComments(journalId, page || 1, limit || 20);
  }

  @Post('comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @CurrentUser() user: User,
    @Param('journalId') journalId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(
      user._id.toString(),
      journalId,
      dto.content,
    );
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @CurrentUser() user: User,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.delete(user._id.toString(), commentId);
  }
}
```

**Step 3: Commit**

```bash
git add server/src/social/controllers/
git commit -m "feat(social): create Like and Comment controllers

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Create Social Module

**Files:**
- Create: `server/src/social/social.module.ts`

**Step 1: Create SocialModule**

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { Like, LikeSchema } from './schemas/like.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Journal, JournalSchema } from '../journals/schemas/journal.schema';
import { FollowService } from './services/follow.service';
import { LikeService } from './services/like.service';
import { CommentService } from './services/comment.service';
import { FollowController } from './controllers/follow.controller';
import { LikeController } from './controllers/like.controller';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Journal.name, schema: JournalSchema },
    ]),
  ],
  controllers: [FollowController, LikeController, CommentController],
  providers: [FollowService, LikeService, CommentService],
  exports: [FollowService, LikeService, CommentService],
})
export class SocialModule {}
```

**Step 2: Commit**

```bash
git add server/src/social/social.module.ts
git commit -m "feat(social): create SocialModule

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 14: Register Social Module in App Module

**Files:**
- Modify: `server/src/app.module.ts`

**Step 1: Import and register SocialModule**

Add import at top:
```typescript
import { SocialModule } from './social/social.module';
```

Add to imports array:
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/meditation'),
    UsersModule,
    AuthModule,
    JournalsModule,
    PracticeRecordsModule,
    SocialModule,  // Add this line
  ],
  // ...rest
})
```

**Step 2: Commit**

```bash
git add server/src/app.module.ts
git commit -m "feat(app): register SocialModule

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Workstream 2: Stats Optimization

### Task 15: Create Stats Module Structure

**Files:**
- Create: `server/src/stats/stats.module.ts`
- Create: `server/src/stats/stats.controller.ts`
- Create: `server/src/stats/stats.service.ts`
- Create: `server/src/stats/aggregation.service.ts`

**Step 1: Create stats directory**

Run: `mkdir -p server/src/stats`

**Step 2: Create AggregationService**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PracticeRecord } from '../practice-records/schemas/practice-record.schema';
import { Journal } from '../journals/schemas/journal.schema';

@Injectable()
export class AggregationService {
  constructor(
    @InjectModel(PracticeRecord.name) private recordModel: Model<PracticeRecord>,
    @InjectModel(Journal.name) private journalModel: Model<Journal>,
  ) {}

  async getHeatmapData(
    userId: string,
    year: number,
    viewMode: 'duration' | 'sessions' | 'mood',
  ) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    if (viewMode === 'duration' || viewMode === 'sessions') {
      const records = await this.recordModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$date',
            totalDuration: { $sum: '$duration' },
            sessionCount: { $sum: 1 },
          },
        },
      ]);

      return this.formatHeatmapData(records, year, viewMode);
    } else {
      const journals = await this.journalModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$date',
            avgMood: { $avg: '$mood' },
          },
        },
      ]);

      return this.formatHeatmapData(journals, year, 'mood');
    }
  }

  private formatHeatmapData(data: any[], year: number, viewMode: string) {
    const dataMap = new Map(data.map((d) => [d._id, d]));
    const cells = [];
    let maxValue = 0;

    const startDate = new Date(year, 0, 1);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + week * 7 + day);

        if (currentDate.getFullYear() !== year) continue;

        const dateStr = currentDate.toISOString().split('T')[0];
        const dayData = dataMap.get(dateStr);

        let value = 0;
        if (dayData) {
          switch (viewMode) {
            case 'duration':
              value = dayData.totalDuration;
              break;
            case 'sessions':
              value = dayData.sessionCount;
              break;
            case 'mood':
              value = dayData.avgMood;
              break;
          }
        }

        if (value > maxValue) maxValue = value;

        cells.push({
          date: dateStr,
          weekIndex: week,
          dayOfWeek: day,
          value,
        });
      }
    }

    return { cells, maxValue };
  }

  async getEmotionCalendarData(userId: string, month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    const journals = await this.journalModel
      .find({
        userId: new Types.ObjectId(userId),
        date: {
          $gte: startDate.toISOString().split('T')[0],
          $lte: endDate.toISOString().split('T')[0],
        },
      })
      .sort({ date: 1 })
      .lean();

    const dayMap = new Map<string, any[]>();
    for (const journal of journals) {
      const existing = dayMap.get(journal.date) || [];
      existing.push(journal);
      dayMap.set(journal.date, existing);
    }

    const days = [];
    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(year, monthNum - 1, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayJournals = dayMap.get(dateStr) || [];

      days.push({
        date: dateStr,
        dayOfMonth: day,
        dayOfWeek: date.getDay(),
        moods: dayJournals.map((j) => j.mood),
        sessionCount: dayJournals.length,
      });
    }

    return { days };
  }

  async getOverview(userId: string) {
    const user = await this.recordModel.db
      .collection('users')
      .findOne({ _id: new Types.ObjectId(userId) });

    return {
      totalDuration: user?.stats?.totalDuration || 0,
      totalSessions: user?.stats?.totalSessions || 0,
      currentStreak: user?.stats?.currentStreak || 0,
      longestStreak: user?.stats?.longestStreak || 0,
      followingCount: user?.stats?.followingCount || 0,
      followerCount: user?.stats?.followerCount || 0,
    };
  }
}
```

**Step 3: Create StatsService**

```typescript
import { Injectable } from '@nestjs/common';
import { AggregationService } from './aggregation.service';

@Injectable()
export class StatsService {
  constructor(private readonly aggregationService: AggregationService) {}

  getHeatmap(userId: string, year: number, viewMode: 'duration' | 'sessions' | 'mood') {
    return this.aggregationService.getHeatmapData(userId, year, viewMode);
  }

  getEmotionCalendar(userId: string, month: string) {
    return this.aggregationService.getEmotionCalendarData(userId, month);
  }

  getOverview(userId: string) {
    return this.aggregationService.getOverview(userId);
  }
}
```

**Step 4: Create StatsController**

```typescript
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('heatmap')
  async getHeatmap(
    @CurrentUser() user: User,
    @Query('year') year: string,
    @Query('viewMode') viewMode: 'duration' | 'sessions' | 'mood',
  ) {
    return this.statsService.getHeatmap(
      user._id.toString(),
      parseInt(year) || new Date().getFullYear(),
      viewMode || 'duration',
    );
  }

  @Get('emotion-calendar')
  async getEmotionCalendar(
    @CurrentUser() user: User,
    @Query('month') month: string,
  ) {
    return this.statsService.getEmotionCalendar(
      user._id.toString(),
      month || new Date().toISOString().slice(0, 7),
    );
  }

  @Get('overview')
  async getOverview(@CurrentUser() user: User) {
    return this.statsService.getOverview(user._id.toString());
  }
}
```

**Step 5: Create StatsModule**

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PracticeRecord, PracticeRecordSchema } from '../practice-records/schemas/practice-record.schema';
import { Journal, JournalSchema } from '../journals/schemas/journal.schema';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AggregationService } from './aggregation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PracticeRecord.name, schema: PracticeRecordSchema },
      { name: Journal.name, schema: JournalSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService, AggregationService],
  exports: [StatsService],
})
export class StatsModule {}
```

**Step 6: Register StatsModule in AppModule**

Modify `server/src/app.module.ts`:

```typescript
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    // ... existing imports
    StatsModule,  // Add this
  ],
})
```

**Step 7: Commit**

```bash
git add server/src/stats/
git add server/src/app.module.ts
git commit -m "feat(stats): create stats module with aggregation service

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 16: Extend Journals Service for Public Feed

**Files:**
- Modify: `server/src/journals/journals.service.ts`
- Modify: `server/src/journals/journals.controller.ts`
- Create: `server/src/journals/dto/update-visibility.dto.ts`

**Step 1: Create UpdateVisibilityDto**

```typescript
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVisibilityDto {
  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
```

**Step 2: Add public feed methods to JournalsService**

Add these methods to the existing `journals.service.ts`:

```typescript
  async getPublicJournals(
    page: number = 1,
    limit: number = 20,
    sort: 'latest' | 'popular' = 'latest',
    search?: string,
  ) {
    const query: any = { isPublic: true };

    if (search) {
      query.$text = { $search: search };
    }

    const sortOption = sort === 'popular' ? { likeCount: -1 } : { createdAt: -1 };

    const journals = await this.journalModel
      .find(query)
      .populate('userId', 'displayName avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await this.journalModel.countDocuments(query);

    return {
      journals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFollowingJournals(userId: string, page: number = 1, limit: number = 20) {
    // Get user's following list
    const follows = await this.journalModel.db
      .collection('follows')
      .find({ followerId: new Types.ObjectId(userId) })
      .toArray();

    const followingIds = follows.map((f) => f.followingId);

    const journals = await this.journalModel
      .find({
        userId: { $in: followingIds },
        isPublic: true,
      })
      .populate('userId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await this.journalModel.countDocuments({
      userId: { $in: followingIds },
      isPublic: true,
    });

    return {
      journals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateVisibility(
    userId: string,
    journalId: string,
    dto: UpdateVisibilityDto,
  ) {
    const journal = await this.journalModel.findOne({
      _id: new Types.ObjectId(journalId),
      userId: new Types.ObjectId(userId),
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    journal.isPublic = dto.isPublic;
    if (dto.isAnonymous !== undefined) {
      journal.isAnonymous = dto.isAnonymous;
    }

    await journal.save();
    return journal;
  }
```

**Step 3: Add endpoints to JournalsController**

Add these methods to `journals.controller.ts`:

```typescript
  @Get('public')
  @Public()
  async getPublicJournals(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('sort') sort?: 'latest' | 'popular',
    @Query('search') search?: string,
  ) {
    return this.journalsService.getPublicJournals(
      page || 1,
      limit || 20,
      sort || 'latest',
      search,
    );
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  async getFollowingJournals(
    @CurrentUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.journalsService.getFollowingJournals(
      user._id.toString(),
      page || 1,
      limit || 20,
    );
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard)
  async updateVisibility(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateVisibilityDto,
  ) {
    return this.journalsService.updateVisibility(user._id.toString(), id, dto);
  }
```

**Step 4: Commit**

```bash
git add server/src/journals/
git commit -m "feat(journals): add public feed and visibility endpoints

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Workstream 3: Frontend - Zustand Stores

### Task 17: Create Social Store

**Files:**
- Create: `meditation-website/src/shared/stores/socialStore.ts`

**Step 1: Create stores directory**

Run: `mkdir -p meditation-website/src/shared/stores`

**Step 2: Create socialStore.ts**

```typescript
import { create } from 'zustand';
import { api } from '../services/apiService';

interface SocialStore {
  following: Set<string>;
  followers: Set<string>;
  likedJournals: Set<string>;
  followingLoaded: boolean;

  loadFollowing: () => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  isFollowing: (userId: string) => boolean;

  likeJournal: (journalId: string) => Promise<void>;
  unlikeJournal: (journalId: string) => Promise<void>;
  isLiked: (journalId: string) => boolean;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  following: new Set(),
  followers: new Set(),
  likedJournals: new Set(),
  followingLoaded: false,

  loadFollowing: async () => {
    try {
      const response = await api.get('/api/social/following');
      const followingIds = response.map((f: any) => f.followingId._id);
      set({
        following: new Set(followingIds),
        followingLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load following:', error);
    }
  },

  followUser: async (userId: string) => {
    try {
      await api.post(`/api/social/follow/${userId}`);
      set((state) => ({
        following: new Set([...state.following, userId]),
      }));
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  },

  unfollowUser: async (userId: string) => {
    try {
      await api.delete(`/api/social/follow/${userId}`);
      set((state) => {
        const newFollowing = new Set(state.following);
        newFollowing.delete(userId);
        return { following: newFollowing };
      });
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  },

  isFollowing: (userId: string) => {
    return get().following.has(userId);
  },

  likeJournal: async (journalId: string) => {
    try {
      await api.post(`/api/journals/${journalId}/like`);
      set((state) => ({
        likedJournals: new Set([...state.likedJournals, journalId]),
      }));
    } catch (error) {
      console.error('Failed to like journal:', error);
      throw error;
    }
  },

  unlikeJournal: async (journalId: string) => {
    try {
      await api.delete(`/api/journals/${journalId}/like`);
      set((state) => {
        const newLiked = new Set(state.likedJournals);
        newLiked.delete(journalId);
        return { likedJournals: newLiked };
      });
    } catch (error) {
      console.error('Failed to unlike journal:', error);
      throw error;
    }
  },

  isLiked: (journalId: string) => {
    return get().likedJournals.has(journalId);
  },
}));
```

**Step 3: Commit**

```bash
git add meditation-website/src/shared/stores/socialStore.ts
git commit -m "feat(frontend): create social zustand store

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

Due to the length constraints, I'll now save this implementation plan and provide you with execution options.

Let me save the plan first:

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

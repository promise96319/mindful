# Social Infrastructure Implementation

This document describes the backend social infrastructure implementation for the meditation community.

## Overview

The social infrastructure enables users to:
- Follow/unfollow other users
- Like public journals
- Comment on public journals
- View social statistics and relationships

## Database Schema Changes

### User Schema Extensions
**File**: `server/src/users/schemas/user.schema.ts`

Added fields:
- `avatar?: string` - Profile avatar URL
- `bio?: string` - User biography (max 500 characters)
- `stats.followingCount: number` - Count of users being followed (default: 0)
- `stats.followerCount: number` - Count of followers (default: 0)

### Journal Schema Extensions
**File**: `server/src/journals/schemas/journal.schema.ts`

Added fields:
- `likeCount: number` - Count of likes (default: 0)
- `commentCount: number` - Count of comments (default: 0)

Added indexes:
- Compound index: `{ isPublic: 1, createdAt: -1 }` - For efficient public journal feed queries
- Text search index: `{ freeText: 'text' }` - For journal content search

Note: `isPublic` and `isAnonymous` fields were already present in the schema.

### Follow Schema
**File**: `server/src/social/schemas/follow.schema.ts`

Fields:
- `followerId: ObjectId` - User who is following (ref: User, indexed)
- `followingId: ObjectId` - User being followed (ref: User, indexed)
- `createdAt: Date` - Timestamp of follow action

Indexes:
- Unique compound index: `{ followerId: 1, followingId: 1 }` - Prevents duplicate follows

### Like Schema
**File**: `server/src/social/schemas/like.schema.ts`

Fields:
- `userId: ObjectId` - User who liked (ref: User, indexed)
- `journalId: ObjectId` - Journal that was liked (ref: Journal, indexed)
- `createdAt: Date` - Timestamp of like action

Indexes:
- Unique compound index: `{ userId: 1, journalId: 1 }` - Prevents duplicate likes

### Comment Schema
**File**: `server/src/social/schemas/comment.schema.ts`

Fields:
- `journalId: ObjectId` - Journal being commented on (ref: Journal, indexed)
- `userId: ObjectId` - User who commented (ref: User)
- `content: string` - Comment text (max 500 characters)
- `createdAt: Date` - Timestamp of comment creation

Indexes:
- Compound index: `{ journalId: 1, createdAt: -1 }` - For efficient comment retrieval

## Services

### FollowService
**File**: `server/src/social/services/follow.service.ts`

Methods:
- `follow(followerId, followingId)` - Create follow relationship
- `unfollow(followerId, followingId)` - Remove follow relationship
- `getFollowing(userId, limit, offset)` - Get users that a user follows
- `getFollowers(userId, limit, offset)` - Get users following a user
- `isFollowing(followerId, followingId)` - Check follow status

Features:
- Atomic counter updates using `$inc` operator
- Prevents self-follows
- Prevents duplicate follows
- Validates user existence

### LikeService
**File**: `server/src/social/services/like.service.ts`

Methods:
- `like(userId, journalId)` - Like a journal
- `unlike(userId, journalId)` - Unlike a journal
- `getLikers(journalId, limit, offset)` - Get users who liked a journal
- `getLikedJournals(userId, limit, offset)` - Get journals liked by a user
- `hasLiked(userId, journalId)` - Check like status

Features:
- Atomic counter updates using `$inc` operator
- Only public journals can be liked
- Prevents duplicate likes
- Privacy enforcement

### CommentService
**File**: `server/src/social/services/comment.service.ts`

Methods:
- `create(userId, journalId, content)` - Create a comment
- `update(commentId, userId, content)` - Update a comment
- `delete(commentId, userId)` - Delete a comment
- `getByJournal(journalId, limit, offset)` - Get comments for a journal
- `getByUser(userId, limit, offset)` - Get comments by a user

Features:
- Atomic counter updates using `$inc` operator
- 500 character content limit
- Ownership validation for update/delete
- Only public journals can be commented on
- Privacy enforcement

## Controllers

### FollowController
**File**: `server/src/social/controllers/follow.controller.ts`

Endpoints:
- `POST /api/social/follow/:userId` - Follow a user
- `DELETE /api/social/follow/:userId` - Unfollow a user
- `GET /api/social/follow/following` - Get current user's following list
- `GET /api/social/follow/followers` - Get current user's followers
- `GET /api/social/follow/:userId/following` - Get user's following list
- `GET /api/social/follow/:userId/followers` - Get user's followers
- `GET /api/social/follow/:userId/status` - Check follow status

### LikeController
**File**: `server/src/social/controllers/like.controller.ts`

Endpoints:
- `POST /api/social/likes/journal/:journalId` - Like a journal
- `DELETE /api/social/likes/journal/:journalId` - Unlike a journal
- `GET /api/social/likes/journal/:journalId/likers` - Get journal likers
- `GET /api/social/likes/user/liked` - Get current user's liked journals
- `GET /api/social/likes/user/:userId/liked` - Get user's liked journals
- `GET /api/social/likes/journal/:journalId/status` - Check like status

### CommentController
**File**: `server/src/social/controllers/comment.controller.ts`

Endpoints:
- `POST /api/social/comments/journal/:journalId` - Create a comment
- `PATCH /api/social/comments/:commentId` - Update a comment
- `DELETE /api/social/comments/:commentId` - Delete a comment
- `GET /api/social/comments/journal/:journalId` - Get journal comments
- `GET /api/social/comments/user` - Get current user's comments
- `GET /api/social/comments/user/:userId` - Get user's comments

All endpoints support pagination with `limit` and `offset` query parameters (default limit: 20).

## Module Integration

### SocialModule
**File**: `server/src/social/social.module.ts`

The SocialModule:
- Registers all social schemas with Mongoose
- Provides all social services
- Exports social controllers
- Exports services for use in other modules

### AppModule Integration
**File**: `server/src/app.module.ts`

SocialModule has been registered in AppModule to enable all social endpoints.

## Best Practices Implemented

1. **Atomic Operations**: All counter updates use MongoDB's `$inc` operator to prevent race conditions
2. **Data Validation**: All inputs are validated for type, format, and business rules
3. **Authorization**: Users can only modify their own data (comments, follows)
4. **Privacy**: Only public journals can be liked or commented on
5. **Indexing**: Strategic indexes for efficient queries on large datasets
6. **Pagination**: All list endpoints support pagination to prevent performance issues
7. **Error Handling**: Comprehensive error messages using NestJS exception filters
8. **Type Safety**: Full TypeScript typing throughout the codebase
9. **Unique Constraints**: Compound unique indexes prevent duplicate relationships
10. **Population**: Efficient data loading with Mongoose population

## API Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Error responses use NestJS standard format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Testing Recommendations

1. Test atomic counter updates under concurrent requests
2. Test unique constraint violations (duplicate follows, likes)
3. Test pagination edge cases
4. Test privacy enforcement (private journals)
5. Test authorization (users modifying others' data)
6. Test validation (content length, ID format)
7. Load test with large datasets to verify index performance

## Future Enhancements

Potential improvements:
- Notifications for follows, likes, and comments
- Blocking/muting users
- Nested comments (replies)
- Comment reactions
- Tag users in comments (@mentions)
- Feed algorithm (personalized, trending)
- User search and discovery
- Activity feeds

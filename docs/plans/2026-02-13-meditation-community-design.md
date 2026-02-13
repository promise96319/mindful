# 冥想日记社区功能重构 - 设计文档

> **版本**: v1.0
> **日期**: 2026-02-13
> **状态**: 已批准
> **设计方案**: 模块化重构 (方案 B)

---

## 1. 需求概述

### 1.1 核心需求
1. **页面重构**：创建个人主页 `/profile`，将 `/journal` 转为社区动态
2. **练习工具优化**：默认全屏模式，完成后提供三选项（记录/继续/返回）
3. **热力图和日历优化**：全面提升视觉、交互和数据展示
4. **统计功能**：个人主页核心统计 + 独立统计页面 `/stats`
5. **社区功能**：日记浏览、点赞、评论、搜索、关注系统
6. **关注机制**：单向关注（Twitter 模式）

### 1.2 目标定位
构建一个**冥想主题的小型社交平台**，专注于冥想心得/经验/感悟的分享与交流。

---

## 2. 系统架构

### 2.1 页面结构与路由

```
/                          # 首页（保持不变）
/tools                     # 工具中心（保持不变）
/tools/:toolType           # 具体工具（重构为全屏模式）
/learn                     # 学习中心（保持不变）

/profile                   # 个人主页 ⭐新增
  ├── /profile/journals    # 我的日记列表
  ├── /profile/following   # 我关注的人
  ├── /profile/followers   # 关注我的人
  └── /profile/edit        # 编辑资料

/stats                     # 统计分析页面 ⭐新增

/journal                   # 社区动态 ⭐重构
  ├── /journal?tab=all     # 全部动态
  ├── /journal?tab=following # 关注动态
  └── /journal/new         # 创建日记（保持）

/journal/:id               # 日记详情（添加评论功能）
/user/:userId              # 其他用户主页 ⭐新增
```

### 2.2 前端架构

**技术栈**：
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (状态管理)
- React Router v6

**目录结构**：
```
src/
├── features/               # 功能模块
│   ├── profile/           # 个人主页
│   ├── community/         # 社区
│   ├── stats/             # 统计
│   └── tools/             # 工具（重构）
├── shared/                # 共享资源
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── stores/            # Zustand stores
└── types/
```

### 2.3 后端架构

**技术栈**：
- NestJS
- MongoDB + Mongoose
- JWT 认证

**模块结构**：
```
modules/
├── auth/              # 认证（已有）
├── users/             # 用户（扩展）
├── journals/          # 日记（扩展）
├── practice-records/  # 练习记录（已有）
├── social/            # 社交功能 ⭐新增
│   ├── follow.controller.ts
│   ├── like.controller.ts
│   └── comment.controller.ts
└── stats/             # 统计聚合 ⭐新增
```

---

## 3. 数据库设计

### 3.1 扩展 User Schema

```typescript
@Schema()
export class User {
  email: string
  displayName: string
  avatar?: string       // ⭐新增
  bio?: string          // ⭐新增

  stats: {
    totalDuration: number
    totalSessions: number
    currentStreak: number
    longestStreak: number
    followingCount: number    // ⭐新增
    followerCount: number     // ⭐新增
  }
}
```

### 3.2 扩展 Journal Schema

```typescript
@Schema()
export class Journal {
  // 原有字段...

  // 社交字段 ⭐新增
  isPublic: boolean
  isAnonymous: boolean
  likeCount: number
  commentCount: number
}

// 索引
@@index([isPublic, createdAt])
@@index({ freeText: 'text' })  // 全文搜索
```

### 3.3 新增 Follow Schema

```typescript
@Schema()
export class Follow {
  followerId: ObjectId
  followingId: ObjectId
  createdAt: Date

  @@index([followerId, followingId], unique: true)
}
```

### 3.4 新增 Like Schema

```typescript
@Schema()
export class Like {
  userId: ObjectId
  journalId: ObjectId
  createdAt: Date

  @@index([userId, journalId], unique: true)
}
```

### 3.5 新增 Comment Schema

```typescript
@Schema()
export class Comment {
  journalId: ObjectId
  userId: ObjectId
  content: string
  createdAt: Date

  @@index([journalId, createdAt])
}
```

---

## 4. 核心功能设计

### 4.1 工具模块重构

**全屏体验流程**：
1. 进入工具 → 默认全屏（可切换非全屏）
2. 练习进行中 → 沉浸式体验
3. 完成后 → 显示三选项：
   - "记录冥想" → 跳转日记表单（预填数据）
   - "继续冥想" → 重新开始
   - "返回" → 返回工具列表

**关键组件**：
- `FullscreenToolWrapper` - 全屏包装器
- `CompletionModal` - 完成模态框

### 4.2 统计模块优化

**ImprovedHeatmap（优化后的热力图）**：
- 视图切换：按时长/按次数/按情绪
- 年份选择器
- 优化颜色方案（深浅渐变）
- 点击单元格查看详情
- 连续打卡标记（🔥图标）
- 周统计条

**ImprovedEmotionCalendar（优化后的情绪日历）**：
- 支持一天多条记录
- 月份导航
- 点击查看详情
- 练习次数指示器

**TrendCharts（趋势图表）**：
- 时长趋势折线图
- 情绪趋势折线图
- 工具使用分布饼图
- 专注度变化面积图

### 4.3 个人主页

**ProfilePage 结构**：
- `ProfileHeader` - 头像、简介、等级、统计概览
- `StatsCards` - 核心指标卡片（6个）
- `ImprovedHeatmap` - 年度练习热力图
- `ImprovedEmotionCalendar` - 月度情绪日历
- Tab 导航：概览/日记/关注/粉丝

**核心指标卡片**：
1. 本周时长
2. 当前连续打卡
3. 平均专注度
4. 平均情绪
5. 已获成就
6. 获赞总数

### 4.4 统计分析页面

**StatsPage 功能**：
- 日期范围选择器
- 快速选择（7天/30天/90天/今年）
- 详细趋势图表
- 数据表格
- 导出功能

### 4.5 社区模块

**CommunityPage（社区动态）**：
- Tab切换：全部动态/关注动态
- 搜索栏（搜索日记内容）
- 瀑布流布局（Masonry）
- 无限滚动

**JournalCard（日记卡片）**：
- 用户信息（头像、昵称/匿名）
- 情绪图标 + 工具标签 + 时长
- 日记内容 + 标签云
- 互动按钮：莲花点赞、评论、分享
- 展开/收起评论区

**CommentsSection（评论区）**：
- 评论列表
- 添加评论表单（限制500字）
- 时间戳

**关注系统**：
- 单向关注（Twitter模式）
- `FollowButton` 组件
- 关注列表页面
- 粉丝列表页面

---

## 5. API 设计

### 5.1 Social APIs

```typescript
// 关注
GET    /api/social/following          # 我关注的人
GET    /api/social/followers          # 关注我的人
POST   /api/social/follow/:userId     # 关注用户
DELETE /api/social/follow/:userId     # 取消关注
GET    /api/social/follow/:userId/status  # 检查关注状态

// 点赞
POST   /api/journals/:id/like         # 点赞日记
DELETE /api/journals/:id/like         # 取消点赞
GET    /api/journals/:id/likes        # 获取点赞列表

// 评论
GET    /api/journals/:id/comments     # 获取评论列表
POST   /api/journals/:id/comments     # 添加评论
DELETE /api/journals/:journalId/comments/:commentId  # 删除评论
```

### 5.2 Journals APIs

```typescript
// 社区动态
GET /api/journals/public?page=1&limit=20&sort=latest  # 公开日记流
GET /api/journals/following?page=1&limit=20           # 关注用户动态
PATCH /api/journals/:id/visibility                    # 更新可见性
GET /api/journals/search?q=keyword                    # 搜索日记
```

### 5.3 Stats APIs

```typescript
GET /api/stats/heatmap?year=2026&viewMode=duration    # 热力图数据
GET /api/stats/emotion-calendar?month=2026-02         # 情绪日历
GET /api/stats/overview                               # 核心统计指标
GET /api/stats/trends?start=2026-01-01&end=2026-01-31  # 趋势数据
```

### 5.4 Users APIs

```typescript
GET /api/users/profile/:userId        # 获取用户资料
PATCH /api/users/profile              # 更新个人资料
```

---

## 6. 状态管理

### 6.1 Social Store (Zustand)

```typescript
interface SocialStore {
  following: Set<string>
  followers: Set<string>
  likedJournals: Set<string>

  loadFollowing: () => Promise<void>
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  isFollowing: (userId: string) => boolean

  likeJournal: (journalId: string) => Promise<void>
  unlikeJournal: (journalId: string) => Promise<void>
  isLiked: (journalId: string) => boolean
}
```

### 6.2 Stats Store (Zustand)

```typescript
interface StatsStore {
  heatmapCache: Map<string, HeatmapData>
  emotionCache: Map<string, EmotionData>

  fetchHeatmap: (year: number, viewMode: string) => Promise<HeatmapData>
  fetchEmotionCalendar: (month: Date) => Promise<EmotionData>
  clearCache: () => void
}
```

---

## 7. 性能优化

### 7.1 前端优化
- 路由级代码分割（React.lazy）
- 虚拟滚动（社区动态瀑布流）
- 图片懒加载
- 使用 WebP 格式

### 7.2 后端优化
- 数据库索引优化
- 查询使用 `.lean()` 提高性能
- 复合索引：`[isPublic, createdAt]`
- 全文搜索索引：`{ freeText: 'text' }`

---

## 8. 实施计划（4个并行工作流）

### 工作流 1：工具模块重构
**时间**：2-3天
**任务**：
- 创建 `FullscreenToolWrapper` 和 `CompletionModal`
- 集成到所有9个工具
- 实现全屏 API
- 测试跨浏览器兼容性

### 工作流 2：统计模块优化
**时间**：3-4天
**任务**：
- 重构 `PracticeHeatmap` 和 `EmotionCalendar`
- 创建 `TrendCharts`
- 后端 Stats API 和 `AggregationService`

### 工作流 3：个人主页和统计页面
**时间**：3-4天
**依赖**：工作流2
**任务**：
- 创建 `/profile` 和 `/stats` 页面
- `ProfileHeader`, `StatsCards` 组件
- 扩展 User Schema
- 用户资料 API

### 工作流 4：社区模块
**时间**：4-5天
**任务**：
- 数据库 Schema（Follow, Like, Comment）
- Social 模块后端（关注、点赞、评论）
- 前端 `socialStore` 和组件
- 搜索功能

---

## 9. 技术规范

### 9.1 命名约定
- 组件：PascalCase
- Hooks：camelCase with `use` prefix
- 常量：UPPER_SNAKE_CASE

### 9.2 Git 分支策略
```
main
├── dev
    ├── feature/tools-fullscreen
    ├── feature/stats-optimization
    ├── feature/profile-page
    └── feature/community
```

### 9.3 Commit 规范
```
feat: 添加功能
fix: 修复bug
refactor: 重构代码
docs: 更新文档
test: 添加测试
```

---

## 10. 测试策略

### 10.1 前端测试
- 单元测试：Vitest
- 组件测试：React Testing Library
- 覆盖率目标：>80%

### 10.2 后端测试
- 单元测试：Jest
- E2E测试：Supertest
- 覆盖率目标：>80%

---

## 附录：关键组件清单

### 前端组件
- `FullscreenToolWrapper`
- `CompletionModal`
- `ImprovedHeatmap`
- `ImprovedEmotionCalendar`
- `TrendCharts`
- `ProfilePage`
- `ProfileHeader`
- `StatsCards`
- `StatsPage`
- `CommunityPage`
- `JournalCard`
- `CommentsSection`
- `FollowButton`
- `PublicJournalFeed`

### 后端服务
- `FollowService`
- `LikeService`
- `CommentService`
- `AggregationService`

### Zustand Stores
- `socialStore`
- `statsStore`

---

**设计完成，等待实施！** 🚀

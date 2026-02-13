import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, MessageCircleIcon, ShareIcon } from '../../../components/icons'
import { MOOD_ICONS } from '../../../types/journal'
import { useAuth } from '../../../hooks/useAuth'
import CommentsSection from './CommentsSection'

interface JournalCardProps {
  journal: {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    isAnonymous: boolean
    date: string
    toolUsed: string
    duration: number
    mood: number
    focus: number
    bodyTags: string[]
    mindTags: string[]
    freeText: string
    likes: number
    isLiked: boolean
    commentsCount: number
    createdAt: string
  }
  comments?: Array<{
    id: string
    userId: string
    userName: string
    userAvatar?: string
    content: string
    createdAt: string
  }>
  onLike: (journalId: string) => Promise<void>
  onUnlike: (journalId: string) => Promise<void>
  onAddComment: (journalId: string, content: string) => Promise<void>
  onShare: (journalId: string) => void
  currentUserAvatar?: string
}

export default function JournalCard({
  journal,
  comments = [],
  onLike,
  onUnlike,
  onAddComment,
  onShare,
  currentUserAvatar
}: JournalCardProps) {
  const { user, promptLogin } = useAuth()
  const [isLiked, setIsLiked] = useState(journal.isLiked)
  const [likesCount, setLikesCount] = useState(journal.likes)
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  // Ensure comments is always an array
  const validComments = Array.isArray(comments) ? comments : []

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      promptLogin()
      return
    }

    if (isLiking) return

    setIsLiking(true)
    const newLikedState = !isLiked

    // Optimistic update
    setIsLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)

    try {
      if (newLikedState) {
        await onLike(journal.id)
      } else {
        await onUnlike(journal.id)
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState)
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1)
      console.error('Failed to toggle like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare(journal.id)
  }

  const toggleComments = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user && !showComments) {
      promptLogin()
      return
    }

    setShowComments(!showComments)
  }

  const displayName = journal.isAnonymous ? 'Anonymous' : (journal.userName || 'Unknown User')
  const profileLink = journal.isAnonymous ? '#' : `/profile/${journal.userId}`
  const totalComments = validComments.length || journal.commentsCount || 0
  const displayedComments = showComments ? validComments : validComments.slice(0, 2)

  return (
    <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft hover:shadow-medium transition-all duration-300 break-inside-avoid mb-4">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        {journal.isAnonymous ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">?</span>
          </div>
        ) : journal.userAvatar ? (
          <Link to={profileLink}>
            <img
              src={journal.userAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:ring-2 hover:ring-primary/50 transition-all"
            />
          </Link>
        ) : (
          <Link to={profileLink}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-primary/50 transition-all">
              <span className="text-white font-semibold">{displayName[0]?.toUpperCase()}</span>
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          {journal.isAnonymous ? (
            <p className="font-medium text-text">{displayName}</p>
          ) : (
            <Link to={profileLink} className="font-medium text-text hover:text-primary transition-colors">
              {displayName}
            </Link>
          )}
          {journal.createdAt && (
            <p className="text-xs text-text-secondary">{formatDate(journal.createdAt)}</p>
          )}
        </div>
      </div>

      {/* Practice Info */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{MOOD_ICONS[journal.mood - 1]}</span>
          <span className="text-text-secondary">Mood</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
          {journal.toolUsed}
        </div>
        <span className="text-text-secondary">{formatDuration(journal.duration)}</span>
      </div>

      {/* Content */}
      {journal.freeText && (
        <p className="text-text mb-3 whitespace-pre-wrap break-words">{journal.freeText}</p>
      )}

      {/* Tags */}
      {(journal.bodyTags.length > 0 || journal.mindTags.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {[...journal.bodyTags, ...journal.mindTags].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-3 border-t border-border-light">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 text-sm font-medium transition-all ${
            isLiked
              ? 'text-pink-500 hover:text-pink-600'
              : 'text-text-secondary hover:text-pink-500'
          } ${isLiking ? 'opacity-50' : ''}`}
        >
          <HeartIcon
            className={`w-5 h-5 transition-all ${isLiked ? 'fill-current' : ''}`}
          />
          {likesCount > 0 && <span>{likesCount}</span>}
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-all"
        >
          <MessageCircleIcon className="w-5 h-5" />
          {totalComments > 0 && <span>{totalComments}</span>}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-all"
        >
          <ShareIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Preview (Xiaohongshu style) */}
      {!showComments && validComments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-light space-y-2">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="text-sm">
              <span className="font-medium text-text mr-2">{comment.userName}:</span>
              <span className="text-text-secondary line-clamp-1">{comment.content}</span>
            </div>
          ))}
          {totalComments > 2 && (
            <button
              onClick={toggleComments}
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              View all {totalComments} comments
            </button>
          )}
        </div>
      )}

      {/* Full Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-border-light">
          <CommentsSection
            journalId={journal.id}
            comments={validComments}
            onAddComment={onAddComment}
            currentUserAvatar={currentUserAvatar}
          />
        </div>
      )}
    </div>
  )
}

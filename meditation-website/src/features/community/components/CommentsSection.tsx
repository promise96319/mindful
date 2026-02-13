import { useState } from 'react'
import { SendIcon } from '../../../components/icons'

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
}

interface CommentsSectionProps {
  journalId: string
  comments: Comment[]
  onAddComment: (journalId: string, content: string) => Promise<void>
  currentUserAvatar?: string
}

export default function CommentsSection({
  journalId,
  comments,
  onAddComment,
  currentUserAvatar
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    try {
      await onAddComment(journalId, newComment.trim())
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatRelativeTime = (dateStr: string) => {
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
    return date.toLocaleDateString()
  }

  return (
    <div className="mt-4 pt-4 border-t border-border-light">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.userAvatar ? (
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white font-semibold">
                    {comment.userName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-text">{comment.userName}</span>
                  <span className="text-xs text-text-secondary">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary break-words">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        {currentUserAvatar ? (
          <img
            src={currentUserAvatar}
            alt="You"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-white font-semibold">?</span>
          </div>
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0, 500))}
            placeholder="Add a comment..."
            disabled={submitting}
            className="w-full pr-10 pl-4 py-2 bg-background-alt border border-border-light rounded-xl text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
      <p className="text-xs text-text-secondary mt-1 ml-11">
        {newComment.length}/500 characters
      </p>
    </div>
  )
}

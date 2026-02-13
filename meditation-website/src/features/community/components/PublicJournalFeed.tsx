import { useState, useEffect, useRef, useCallback } from 'react'
import JournalCard from './JournalCard'
import type { PublicJournal, Comment } from '../../../services/apiService'
import { getComments } from '../../../services/apiService'

interface PublicJournalFeedProps {
  fetchJournals: (page: number, limit: number, filter?: string, searchQuery?: string) => Promise<PublicJournal[]>
  onLike: (journalId: string) => Promise<void>
  onUnlike: (journalId: string) => Promise<void>
  onAddComment: (journalId: string, content: string) => Promise<void>
  onShare: (journalId: string) => void
  filter?: 'all' | 'following'
  searchQuery?: string
  currentUserAvatar?: string
}

export default function PublicJournalFeed({
  fetchJournals,
  onLike,
  onUnlike,
  onAddComment,
  onShare,
  filter = 'all',
  searchQuery = '',
  currentUserAvatar
}: PublicJournalFeedProps) {
  const [journals, setJournals] = useState<PublicJournal[]>([])
  const [commentsMap, setCommentsMap] = useState<Map<string, Comment[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Load comments for a journal
  const loadCommentsForJournal = useCallback(async (journalId: string) => {
    try {
      const comments = await getComments(journalId)
      setCommentsMap(prev => new Map(prev).set(journalId, comments))
    } catch (error) {
      console.error(`Failed to load comments for journal ${journalId}:`, error)
      setCommentsMap(prev => new Map(prev).set(journalId, []))
    }
  }, [])

  const loadJournals = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const newJournals = await fetchJournals(pageNum, 20, filter, searchQuery)

      if (isLoadMore) {
        setJournals(prev => [...prev, ...newJournals])
      } else {
        setJournals(newJournals)
      }

      // Load comments for new journals
      newJournals.forEach(journal => {
        if (!commentsMap.has(journal.id)) {
          loadCommentsForJournal(journal.id)
        }
      })

      setHasMore(newJournals.length === 20)
    } catch (error) {
      console.error('Failed to fetch journals:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [fetchJournals, filter, searchQuery, commentsMap, loadCommentsForJournal])

  // Reload comments after adding a new comment
  const handleAddComment = useCallback(async (journalId: string, content: string) => {
    await onAddComment(journalId, content)
    // Reload comments for this journal
    await loadCommentsForJournal(journalId)
  }, [onAddComment, loadCommentsForJournal])

  // Reset and load on filter/search change
  useEffect(() => {
    setPage(0)
    setJournals([])
    setHasMore(true)
    loadJournals(0, false)
  }, [filter, searchQuery, loadJournals])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          const nextPage = page + 1
          setPage(nextPage)
          loadJournals(nextPage, true)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, loadingMore, page, loadJournals])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (journals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary text-lg">
          {searchQuery
            ? 'No journals found matching your search.'
            : filter === 'following'
            ? 'No journals from people you follow yet.'
            : 'No public journals yet. Be the first to share!'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Masonry Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {journals.map((journal) => (
          <JournalCard
            key={journal.id}
            journal={{
              ...journal,
              userAvatar: journal.userPhotoURL,
            }}
            comments={commentsMap.get(journal.id) || []}
            onLike={onLike}
            onUnlike={onUnlike}
            onAddComment={handleAddComment}
            onShare={onShare}
            currentUserAvatar={currentUserAvatar}
          />
        ))}
      </div>

      {/* Intersection Observer Target */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {loadingMore && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      {!hasMore && journals.length > 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary text-sm">
            You've reached the end of the feed.
          </p>
        </div>
      )}
    </div>
  )
}

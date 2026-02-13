import { useState, useCallback } from 'react'
import { likeJournal as apiLikeJournal, unlikeJournal as apiUnlikeJournal } from '../../../services/apiService'
import { useSocialStore } from '../../../shared/stores/socialStore'

interface UseLikeReturn {
  isLiked: boolean
  isLoading: boolean
  error: string | null
  likeJournal: () => Promise<void>
  unlikeJournal: () => Promise<void>
  toggleLike: () => Promise<void>
}

export function useLike(journalId: string): UseLikeReturn {
  const { isLiked: checkIsLiked, likeJournal: storeLikeJournal, unlikeJournal: storeUnlikeJournal } = useSocialStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLiked = checkIsLiked(journalId)

  const likeJournal = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await apiLikeJournal(journalId)
      storeLikeJournal(journalId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like journal'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [journalId, isLoading, storeLikeJournal])

  const unlikeJournal = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await apiUnlikeJournal(journalId)
      storeUnlikeJournal(journalId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlike journal'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [journalId, isLoading, storeUnlikeJournal])

  const toggleLike = useCallback(async () => {
    if (isLiked) {
      await unlikeJournal()
    } else {
      await likeJournal()
    }
  }, [isLiked, likeJournal, unlikeJournal])

  return {
    isLiked,
    isLoading,
    error,
    likeJournal,
    unlikeJournal,
    toggleLike,
  }
}

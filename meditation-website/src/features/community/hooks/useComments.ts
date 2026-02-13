import { useState, useEffect, useCallback } from 'react'
import { getComments, type Comment } from '../../../services/apiService'

interface UseCommentsReturn {
  comments: Comment[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useComments(journalId: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    if (!journalId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getComments(journalId)
      setComments(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comments'
      setError(errorMessage)
      console.error('Error fetching comments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [journalId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    comments,
    isLoading,
    error,
    refetch: fetchComments,
  }
}

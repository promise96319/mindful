import { useState, useCallback } from 'react'
import { addComment, type Comment } from '../../../services/apiService'

interface UseAddCommentReturn {
  isLoading: boolean
  error: string | null
  addComment: (text: string) => Promise<Comment | null>
}

export function useAddComment(journalId: string): UseAddCommentReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitComment = useCallback(
    async (text: string): Promise<Comment | null> => {
      if (isLoading || !text.trim()) return null

      setIsLoading(true)
      setError(null)

      try {
        const comment = await addComment(journalId, text.trim())
        return comment
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add comment'
        setError(errorMessage)
        console.error('Error adding comment:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [journalId, isLoading],
  )

  return {
    isLoading,
    error,
    addComment: submitComment,
  }
}

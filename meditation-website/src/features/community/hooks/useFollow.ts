import { useState, useCallback } from 'react'
import { followUser as apiFollowUser, unfollowUser as apiUnfollowUser } from '../../../services/apiService'
import { useSocialStore } from '../../../shared/stores/socialStore'

interface UseFollowReturn {
  isFollowing: boolean
  isLoading: boolean
  error: string | null
  followUser: () => Promise<void>
  unfollowUser: () => Promise<void>
  toggleFollow: () => Promise<void>
}

export function useFollow(userId: string): UseFollowReturn {
  const { isFollowing: checkIsFollowing, followUser: storeFollowUser, unfollowUser: storeUnfollowUser } = useSocialStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFollowing = checkIsFollowing(userId)

  const followUser = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await apiFollowUser(userId)
      storeFollowUser(userId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to follow user'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [userId, isLoading, storeFollowUser])

  const unfollowUser = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      await apiUnfollowUser(userId)
      storeUnfollowUser(userId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unfollow user'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [userId, isLoading, storeUnfollowUser])

  const toggleFollow = useCallback(async () => {
    if (isFollowing) {
      await unfollowUser()
    } else {
      await followUser()
    }
  }, [isFollowing, followUser, unfollowUser])

  return {
    isFollowing,
    isLoading,
    error,
    followUser,
    unfollowUser,
    toggleFollow,
  }
}

import { useState } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>
}

export default function FollowButton({ userId, isFollowing, onFollowToggle }: FollowButtonProps) {
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(isFollowing)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    setLoading(true)
    const newState = !following

    // Optimistic update
    setFollowing(newState)

    try {
      await onFollowToggle(userId, newState)
    } catch (error) {
      // Revert on error
      setFollowing(!newState)
      console.error('Failed to toggle follow:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
        ${following
          ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
          : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-medium hover:scale-105'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : following ? (
        <UserCheck className="w-4 h-4" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      <span>{following ? 'Following' : 'Follow'}</span>
    </button>
  )
}

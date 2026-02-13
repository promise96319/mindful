import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SocialState {
  following: Set<string>
  followers: Set<string>
  likedJournals: Set<string>
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  isFollowing: (userId: string) => boolean
  likeJournal: (journalId: string) => void
  unlikeJournal: (journalId: string) => void
  isLiked: (journalId: string) => boolean
  loadFollowing: (userIds: string[]) => void
  loadFollowers: (userIds: string[]) => void
  loadLikedJournals: (journalIds: string[]) => void
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      following: new Set<string>(),
      followers: new Set<string>(),
      likedJournals: new Set<string>(),

      followUser: (userId: string) => {
        set((state) => ({
          following: new Set(state.following).add(userId),
        }))
      },

      unfollowUser: (userId: string) => {
        set((state) => {
          const newFollowing = new Set(state.following)
          newFollowing.delete(userId)
          return { following: newFollowing }
        })
      },

      isFollowing: (userId: string) => {
        return get().following.has(userId)
      },

      likeJournal: (journalId: string) => {
        set((state) => ({
          likedJournals: new Set(state.likedJournals).add(journalId),
        }))
      },

      unlikeJournal: (journalId: string) => {
        set((state) => {
          const newLikedJournals = new Set(state.likedJournals)
          newLikedJournals.delete(journalId)
          return { likedJournals: newLikedJournals }
        })
      },

      isLiked: (journalId: string) => {
        return get().likedJournals.has(journalId)
      },

      loadFollowing: (userIds: string[]) => {
        set({ following: new Set(userIds) })
      },

      loadFollowers: (userIds: string[]) => {
        set({ followers: new Set(userIds) })
      },

      loadLikedJournals: (journalIds: string[]) => {
        set({ likedJournals: new Set(journalIds) })
      },
    }),
    {
      name: 'social-storage',
      // Custom serialization for Set objects
      partialize: (state) => ({
        following: Array.from(state.following),
        followers: Array.from(state.followers),
        likedJournals: Array.from(state.likedJournals),
      }),
      // Custom deserialization for Set objects
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.following = new Set(state.following as unknown as string[])
          state.followers = new Set(state.followers as unknown as string[])
          state.likedJournals = new Set(state.likedJournals as unknown as string[])
        }
      },
    },
  ),
)

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../hooks/useAuth'
import { getPublicJournals, likeJournal, unlikeJournal, addComment } from '../../../services/apiService'
import SearchBar from '../components/SearchBar'
import PublicJournalFeed from '../components/PublicJournalFeed'

export default function CommunityPage() {
  const { t } = useTranslation('journal')
  const { user, promptLogin } = useAuth()
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchJournals = useCallback(async (
    page: number,
    limit: number,
    filter?: string,
    searchQuery?: string
  ) => {
    try {
      const journals = await getPublicJournals(
        page,
        limit,
        filter as 'all' | 'following' | undefined,
        searchQuery
      )
      return journals
    } catch (error) {
      console.error('Failed to fetch public journals:', error)
      return []
    }
  }, [])

  const handleLike = async (journalId: string) => {
    try {
      await likeJournal(journalId)
    } catch (error) {
      console.error('Failed to like journal:', error)
      throw error
    }
  }

  const handleUnlike = async (journalId: string) => {
    try {
      await unlikeJournal(journalId)
    } catch (error) {
      console.error('Failed to unlike journal:', error)
      throw error
    }
  }

  const handleAddComment = async (journalId: string, content: string) => {
    try {
      await addComment(journalId, content)
    } catch (error) {
      console.error('Failed to add comment:', error)
      throw error
    }
  }

  const handleShare = (journalId: string) => {
    // Copy link to clipboard
    const url = `${window.location.origin}/journal/${journalId}`
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Show toast notification
      console.log('Link copied to clipboard:', url)
    }).catch(err => {
      console.error('Failed to copy link:', err)
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {t('communityTitle', { defaultValue: 'Community' })}
          </h1>
          <p className="text-text-secondary">
            {t('communitySubtitle', { defaultValue: 'Explore meditation journeys from our community' })}
          </p>
        </div>
        {user ? (
          <Link
            to="/journal/new"
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            {t('newEntry', { defaultValue: 'New Entry' })}
          </Link>
        ) : (
          <button
            onClick={promptLogin}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            {t('newEntry', { defaultValue: 'New Entry' })}
          </button>
        )}
      </div>

      {/* Tabs and Search */}
      <div className="mb-8 space-y-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-card border border-border-light rounded-2xl p-1.5 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-soft'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t('allTab', { defaultValue: 'All' })}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'following'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-soft'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t('followingTab', { defaultValue: 'Following' })}
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder={t('searchPlaceholder', { defaultValue: 'Search journal entries...' })}
        />
      </div>

      {/* Feed */}
      <PublicJournalFeed
        fetchJournals={fetchJournals}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onAddComment={handleAddComment}
        onShare={handleShare}
        filter={activeTab}
        searchQuery={searchQuery}
        currentUserAvatar={user?.photoURL}
      />
    </div>
  )
}

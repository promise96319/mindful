import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../hooks/useAuth'
import { usePracticeStats } from '../../../hooks/usePracticeStats'
import { getUserData } from '../../../services/apiService'
import { getJournals } from '../../../services/apiService'
import { getLevel } from '../../../utils/levelSystem'
import ProfileHeader from '../components/ProfileHeader'
import StatsCards from '../components/StatsCards'
import ImprovedHeatmap from '../../stats/components/ImprovedHeatmap'
import ImprovedEmotionCalendar from '../../stats/components/ImprovedEmotionCalendar'
import type { AppUser } from '../../../types/user'
import type { JournalEntry } from '../../../types/journal'

type TabType = 'overview' | 'journals' | 'following' | 'followers'

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser } = useAuth()
  const { getStats, records } = usePracticeStats()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const isZh = i18n.language === 'zh-CN'

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [profileUser, setProfileUser] = useState<AppUser | null>(null)
  const [journals, setJournals] = useState<(JournalEntry & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  const isOwnProfile = !userId || userId === currentUser?.id

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        if (isOwnProfile && currentUser) {
          const userData = await getUserData()
          setProfileUser(userData)
        } else if (userId) {
          // TODO: Implement fetching other user's profile
          // For now, redirect to own profile
          navigate('/profile')
          return
        }

        // Load journals
        const journalData = await getJournals()
        setJournals(journalData)
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      loadProfile()
    } else {
      setLoading(false)
    }
  }, [userId, currentUser, isOwnProfile, navigate])

  const stats = useMemo(() => getStats(), [getStats])

  const level = useMemo(
    () => getLevel(profileUser?.totalPracticeSeconds || 0),
    [profileUser?.totalPracticeSeconds]
  )

  // Calculate average focus and mood from journals
  const { avgFocus, avgMood } = useMemo(() => {
    if (journals.length === 0) return { avgFocus: 0, avgMood: 0 }
    const totalFocus = journals.reduce((sum, j) => sum + j.focus, 0)
    const totalMood = journals.reduce((sum, j) => sum + j.mood, 0)
    return {
      avgFocus: totalFocus / journals.length,
      avgMood: totalMood / journals.length,
    }
  }, [journals])

  // Transform records for heatmap (currently unused, will be used in future enhancements)
  // const practiceRecords = useMemo(
  //   () => records.map((r) => ({ date: r.date, duration: r.duration })),
  //   [records]
  // )

  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            {isZh ? '个人资料' : 'Profile'}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            {isZh ? '请登录以查看个人资料' : 'Please log in to view profile'}
          </p>
        </div>
      </div>
    )
  }

  if (loading || !profileUser) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: isZh ? '概览' : 'Overview' },
    { id: 'journals', label: isZh ? '日志' : 'Journals' },
    { id: 'following', label: isZh ? '关注中' : 'Following' },
    { id: 'followers', label: isZh ? '关注者' : 'Followers' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Profile Header */}
      <div className="mb-8">
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          level={level}
          followers={0}
          following={0}
          onEditProfile={() => {
            // TODO: Implement edit profile modal
            console.log('Edit profile')
          }}
          onFollowToggle={() => {
            // TODO: Implement follow/unfollow
            console.log('Toggle follow')
          }}
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                {isZh ? '统计概览' : 'Statistics'}
              </h2>
              <StatsCards
                weeklyDuration={stats.weekTotal}
                streak={stats.streak}
                avgFocus={avgFocus}
                avgMood={avgMood}
                achievements={0}
                totalLikes={0}
              />
            </div>

            {/* Practice Heatmap */}
            <div>
              <ImprovedHeatmap records={records} />
            </div>

            {/* Emotion Calendar */}
            <div>
              <ImprovedEmotionCalendar journals={journals} />
            </div>
          </>
        )}

        {activeTab === 'journals' && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">
              {isZh ? '日志列表即将推出' : 'Journals list coming soon'}
            </p>
          </div>
        )}

        {activeTab === 'following' && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">
              {isZh ? '关注列表即将推出' : 'Following list coming soon'}
            </p>
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)]">
              {isZh ? '粉丝列表即将推出' : 'Followers list coming soon'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

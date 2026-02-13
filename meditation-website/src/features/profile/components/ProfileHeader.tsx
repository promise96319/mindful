import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { AppUser } from '../../../types/user'

interface ProfileHeaderProps {
  user: AppUser
  isOwnProfile: boolean
  level: {
    level: number
    nameEn: string
    nameZh: string
  }
  followers?: number
  following?: number
  onEditProfile?: () => void
  onFollowToggle?: () => void
  isFollowing?: boolean
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  level,
  followers = 0,
  following = 0,
  onEditProfile,
  onFollowToggle,
  isFollowing = false,
}: ProfileHeaderProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh-CN'
  const navigate = useNavigate()

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-24 h-24 rounded-2xl object-cover shadow-[var(--shadow-soft)]"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-[var(--shadow-soft)]">
              <span className="text-4xl text-white font-bold">
                {user.displayName?.[0] || '?'}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                {user.displayName}
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                {user.email}
              </p>
              {/* Level Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-full">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  Lv.{level.level} {isZh ? level.nameZh : level.nameEn}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {isOwnProfile ? (
                <button
                  onClick={onEditProfile}
                  className="px-6 py-2.5 text-sm font-medium text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-300"
                >
                  {isZh ? '编辑资料' : 'Edit Profile'}
                </button>
              ) : (
                <button
                  onClick={onFollowToggle}
                  className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isFollowing
                      ? 'text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/5'
                      : 'text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90'
                  }`}
                >
                  {isFollowing ? (isZh ? '已关注' : 'Following') : (isZh ? '关注' : 'Follow')}
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-6 text-sm">
            <button
              onClick={() => navigate('#followers')}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              <span className="font-semibold text-[var(--color-text)]">{followers}</span>
              <span className="text-[var(--color-text-secondary)] ml-1">
                {isZh ? '关注者' : 'Followers'}
              </span>
            </button>
            <button
              onClick={() => navigate('#following')}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              <span className="font-semibold text-[var(--color-text)]">{following}</span>
              <span className="text-[var(--color-text-secondary)] ml-1">
                {isZh ? '关注中' : 'Following'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

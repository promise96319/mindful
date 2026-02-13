import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: string
  noindex?: boolean
}

export default function SEO({
  title,
  description,
  keywords,
  image = '/og-image.png',
  type = 'website',
  noindex = false,
}: SEOProps) {
  const { t, i18n } = useTranslation('common')

  const siteTitle = t('siteName', { defaultValue: 'Mindful' })
  const defaultTitle = t('seo.defaultTitle', {
    defaultValue: 'Mindful - Simple Meditation Learning Platform & Community',
  })
  const defaultDescription = t('seo.defaultDescription', {
    defaultValue:
      'Mindful provides easy-to-use meditation learning resources, practice tools, and community sharing for everyone seeking inner peace.',
  })
  const defaultKeywords = t('seo.defaultKeywords', {
    defaultValue:
      'meditation,mindfulness,breathing exercises,relaxation,focus,meditation community,meditation tools',
  })

  const pageTitle = title ? `${title} | ${siteTitle}` : defaultTitle
  const pageDescription = description || defaultDescription
  const pageKeywords = keywords || defaultKeywords
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const imageUrl = image.startsWith('http')
    ? image
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`

  const lang = i18n.language === 'zh-CN' ? 'zh-CN' : 'en'
  const alternateLang = i18n.language === 'zh-CN' ? 'en' : 'zh-CN'

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={lang === 'zh-CN' ? 'zh_CN' : 'en_US'} />
      <meta
        property="og:locale:alternate"
        content={alternateLang === 'zh-CN' ? 'zh_CN' : 'en_US'}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}

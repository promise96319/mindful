import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import zhCNCommon from './locales/zh-CN/common.json'
import zhCNHome from './locales/zh-CN/home.json'
import zhCNLearn from './locales/zh-CN/learn.json'
import zhCNTools from './locales/zh-CN/tools.json'

import enCommon from './locales/en/common.json'
import enHome from './locales/en/home.json'
import enLearn from './locales/en/learn.json'
import enTools from './locales/en/tools.json'

const savedLanguage = localStorage.getItem('language')
const browserLanguage = navigator.language

const getInitialLanguage = () => {
  if (savedLanguage) return savedLanguage
  if (browserLanguage.startsWith('zh')) return 'zh-CN'
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': {
      common: zhCNCommon,
      home: zhCNHome,
      learn: zhCNLearn,
      tools: zhCNTools,
    },
    en: {
      common: enCommon,
      home: enHome,
      learn: enLearn,
      tools: enTools,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  ns: ['common', 'home', 'learn', 'tools'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

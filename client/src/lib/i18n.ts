import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './locales'

// Мова за замовчуванням однакова на сервері й клієнті (без hydration mismatch);
// збережена мова підхоплюється після монтування (див. Providers).
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  })
}

export default i18n

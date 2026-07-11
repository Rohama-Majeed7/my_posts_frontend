import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import urTranslation from './locales/ur/translation.json';

i18n
  .use(LanguageDetector)           // Detects browser language
  .use(initReactI18next)           // Passes i18n to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      ur: { translation: urTranslation },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
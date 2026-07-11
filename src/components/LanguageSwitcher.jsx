import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
          currentLang === 'en'
            ? 'bg-blue-600 text-white shadow'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => changeLanguage('ur')}
        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
          currentLang === 'ur'
            ? 'bg-blue-600 text-white shadow'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        اردو
      </button>
    </div>
  );
};

export default LanguageSwitcher;
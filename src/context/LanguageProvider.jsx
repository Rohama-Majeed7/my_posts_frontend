import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isUrdu = i18n.language === 'ur';

    // Set direction on <html> tag
    document.documentElement.setAttribute('dir', isUrdu ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', i18n.language);

    // Optional: Add a class for extra styling control
    if (isUrdu) {
      document.documentElement.classList.add('urdu-mode');
    } else {
      document.documentElement.classList.remove('urdu-mode');
    }
  }, [i18n.language]);

  return <>{children}</>;
};

export default LanguageProvider;
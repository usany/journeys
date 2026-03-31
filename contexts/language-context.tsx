import React, { createContext, useContext, useState } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  text: (key: TranslationKey) => string;
}

type TranslationKey = keyof typeof translations.ko;

const translations = {
  ko: {
    'app.title': '경희대 서울캠퍼스',
    'app.subtitle': '어디로 떠나볼까요?',
    'settings.title': '설정',
    'settings.appearance': '외관',
    'settings.theme': '테마',
    'settings.about': '정보',
    'settings.version': '버전',
    'settings.language': '언어',
    'theme.light': '라이트',
    'theme.dark': '다크',
    'language.korean': '한국어',
    'language.english': 'English',
    'button.choose_photo': '사진 선택',
    'button.use_photo': '이 사진 사용',
  },
  en: {
    'app.title': 'Kyung Hee University Seoul Campus',
    'app.subtitle': 'Where should we go?',
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.language': 'Language',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'language.korean': '한국어',
    'language.english': 'English',
    'button.choose_photo': 'Choose a photo',
    'button.use_photo': 'Use this photo',
  },
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ko');

  const toggleLanguage = () => {
    setLanguageState(prevLang => prevLang === 'ko' ? 'en' : 'ko');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const text = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, text }}>
      {children}
    </LanguageContext.Provider>
  );
};

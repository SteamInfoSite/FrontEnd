import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const STORAGE_KEY = "steaminfo.language";
const SUPPORTED_LANGUAGES = ["ko", "en", "ja"];
const LanguageContext = createContext(null);

function readSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(saved) ? saved : "ko";
  } catch {
    return "ko";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readSavedLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const saveLanguage = (nextLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) return false;
    try {
      localStorage.setItem(STORAGE_KEY, nextLanguage);
      setLanguage(nextLanguage);
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo(() => ({
    language,
    saveLanguage,
    t: (key, values = {}) => {
      if (key == null) return "";
      const template = translations[language]?.[key] ?? translations.ko[key] ?? String(key);
      return String(template).replace(/\{\{(\w+)\}\}/g, (match, name) =>
        values[name] == null ? match : String(values[name]));
    },
    formatNumber: (number) => {
      if (number == null) return "—";
      const value = Number(number);
      return Number.isFinite(value)
        ? value.toLocaleString(language === "ko" ? "ko-KR" : language === "ja" ? "ja-JP" : "en-US")
        : String(number);
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return context;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/lib/services";
import { dictionaries, type Dictionary, es } from "@/lib/i18n/dictionaries";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  t: es,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState("es");

  useEffect(() => {
    // Intentar leer de localStorage primero para que cargue rápido
    const cached = localStorage.getItem("app_language");
    if (cached) setLanguageState(cached);

    if (user) {
      profileService.getProfile(user.id).then((p) => {
        if (p?.app_language) {
          setLanguageState(p.app_language);
          localStorage.setItem("app_language", p.app_language);
        }
      });
    }
  }, [user]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
    if (user) {
      profileService.updateProfile(user.id, { app_language: lang }).catch(console.error);
    }
  };

  const t = dictionaries[language] || dictionaries["es"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

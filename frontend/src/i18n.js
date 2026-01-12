import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en.json";
import translationFR from "./locales/fr.json";
import translationAR from "./locales/ar.json";

const resources = {
    en: {
        translation: translationEN
    },
    fr: {
        translation: translationFR
    },
    ar: {
        translation: translationAR
    }
};

i18n
    .use(LanguageDetector) 
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("i18nextLng") || "fr", 
        fallbackLng: "fr",
        supportedLngs: ["en", "fr", "ar"], 

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'] 
        },

        interpolation: {
            escapeValue: false 
        }
    });

export default i18n;
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import direct des fichiers JSON
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
    .use(LanguageDetector) // Détecte la langue du navigateur
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("i18nextLng") || "fr", // Langue par défaut
        fallbackLng: "fr",
        supportedLngs: ["en", "fr", "ar"], // Langues supportées

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'] // Mémoriser le choix
        },

        interpolation: {
            escapeValue: false // React protège déjà contre les failles XSS
        }
    });

export default i18n;
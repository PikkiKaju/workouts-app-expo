import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        resources: {
            en: {
                translation: {
                    workout_table_header: {
                        exercise_name: "Exercise Name",
                        series: "Series",
                        weights: "Weights",
                    }
                }
            },
        }
    });

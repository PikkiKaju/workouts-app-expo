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
                        exercise_name: "Name",
                        sets: "Sets",
                        weights: "Weights",
                    },
                    content: {
                        header: {
                            description_toggle: "Description",
                            description_input_placeholder: "Add description here...",
                            menu: {
                                edit_name: "Rename",
                                edit_date: "Change Date",
                                edit_description: "Edit Description",
                                save: "Save",
                                cancel: "Cancel",
                                delete: {
                                    title: "Delete Workout",
                                    message: "Are you sure you want to delete this workout?",
                                    confirm: "Delete",
                                    cancel: "Cancel",
                                },
                            }
                        },
                        exercisesHeading: "Exercises List:",
                    }
                }
            },
        }
    });

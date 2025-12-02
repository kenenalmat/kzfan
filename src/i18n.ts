import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Header
            "header.admin": "Admin",

            // Hero
            "hero.title": "Support Our Team",
            "hero.subtitle": "Around the World",
            "hero.description": "Find upcoming sports events featuring Kazakhstan athletes and teams in your city.",
            "hero.searchPlaceholder": "Search by country or city...",

            // Events
            "events.upcoming": "Upcoming Events",
            "events.results": "{{count}} result",
            "events.results_plural": "{{count}} results",
            "events.noEvents": "No events found matching your search.",
            "events.vs": "vs",

            // Admin
            "admin.title": "Add New Event",
            "admin.manage": "Manage Events",
            "admin.sport": "Sport",
            "admin.team": "Team",
            "admin.opponent": "Opponent",
            "admin.date": "Date & Time",
            "admin.location": "Location",
            "admin.venue": "Venue",
            "admin.imageUrl": "Image URL",
            "admin.addEvent": "Add Event",
            "admin.edit": "Edit",
            "admin.delete": "Delete",
            "admin.save": "Save",
            "admin.cancel": "Cancel",

            // Login
            "login.title": "Admin Login",
            "login.username": "Username",
            "login.password": "Password",
            "login.submit": "Login",
            "login.error": "Invalid credentials",

            // Footer
            "footer.text": "Supporting our athletes worldwide."
        }
    },
    kk: {
        translation: {
            // Header
            "header.admin": "Әкімші",

            // Hero
            "hero.title": "Біздің командаға",
            "hero.subtitle": "Қолдау көрсетіңіз",
            "hero.description": "Қазақстан спортшылары мен командаларының қаладағы алдағы спорт іс-шараларын табыңыз.",
            "hero.searchPlaceholder": "Ел немесе қала бойынша іздеу...",

            // Events
            "events.upcoming": "Алдағы іс-шаралар",
            "events.results": "{{count}} нәтиже",
            "events.results_plural": "{{count}} нәтиже",
            "events.noEvents": "Іздеуге сәйкес іс-шаралар табылмады.",
            "events.vs": "қарсы",

            // Admin
            "admin.title": "Жаңа іс-шара қосу",
            "admin.manage": "Іс-шараларды басқару",
            "admin.sport": "Спорт түрі",
            "admin.team": "Команда",
            "admin.opponent": "Қарсылас",
            "admin.date": "Күні мен уақыты",
            "admin.location": "Орналасқан жері",
            "admin.venue": "Алаң",
            "admin.imageUrl": "Сурет URL",
            "admin.addEvent": "Іс-шара қосу",
            "admin.edit": "Өңдеу",
            "admin.delete": "Жою",
            "admin.save": "Сақтау",
            "admin.cancel": "Болдырмау",

            // Login
            "login.title": "Әкімші кіру",
            "login.username": "Пайдаланушы аты",
            "login.password": "Құпия сөз",
            "login.submit": "Кіру",
            "login.error": "Қате тіркелгі деректері",

            // Footer
            "footer.text": "Біздің спортшыларды әлем бойынша қолдаймыз."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'kk', // Default to Kazakh
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

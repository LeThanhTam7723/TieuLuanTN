import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các file ngôn ngữ của bạn
import translationEN from './locales/en/translation.json'; // Đặt tên file là translation.json
import translationVI from './locales/vi/translation.json'; // Đặt tên file là translation.json

// Đảm bảo bạn có các thư mục này:
// src/locales/en/translation.json
// src/locales/vi/translation.json

const resources = {
    en: {
        translation: translationEN
    },
    vi: {
        translation: translationVI
    }
};

i18n
    .use(LanguageDetector) // Sử dụng trình phát hiện ngôn ngữ của trình duyệt
    .use(initReactI18next) // Truyền instance i18n vào react-i18next
    .init({
        resources,
        fallbackLng: 'vi', // Ngôn ngữ dự phòng nếu ngôn ngữ hiện tại không có bản dịch
        debug: true, // Bật debug mode (chỉ nên dùng trong dev)

        interpolation: {
            escapeValue: false // React đã tự động escape XSS
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'] // Lưu lựa chọn ngôn ngữ vào localStorage
        }
    });

export default i18n;
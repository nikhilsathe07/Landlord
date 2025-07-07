import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.maintenance": "Maintenance",
      "nav.history": "History", 
      "nav.chat": "Chat",
      "nav.rent": "Rent",
      "nav.profile": "Profile",
      "nav.logout": "Logout",

      // Common
      "common.loading": "Loading...",
      "common.submit": "Submit",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.confirm": "Confirm",
      "common.back": "Back",
      "common.next": "Next",
      "common.previous": "Previous",

      // Dashboard
      "dashboard.welcome": "Welcome back",
      "dashboard.openRequests": "Open Requests",
      "dashboard.completedRequests": "Completed",
      "dashboard.pendingPayments": "Pending Payments",
      "dashboard.recentActivity": "Recent Activity",

      // Maintenance
      "maintenance.newRequest": "New Request",
      "maintenance.category": "Category",
      "maintenance.urgency": "Urgency",
      "maintenance.description": "Description",
      "maintenance.photos": "Photos",
      "maintenance.submit": "Submit Request",
      "maintenance.status.pending": "Pending",
      "maintenance.status.inProgress": "In Progress",
      "maintenance.status.completed": "Completed",
      "maintenance.urgency.low": "Low",
      "maintenance.urgency.medium": "Medium",
      "maintenance.urgency.high": "High",
      "maintenance.category.plumbing": "Plumbing",
      "maintenance.category.electrical": "Electrical",
      "maintenance.category.general": "General",

      // Rent
      "rent.tracker": "Rent Tracker",
      "rent.status.paid": "Paid",
      "rent.status.pending": "Pending", 
      "rent.status.overdue": "Overdue",
      "rent.markPaid": "Mark as Paid",
      "rent.requestDelay": "Request Delay",

      // Chat
      "chat.typeMessage": "Type a message...",
      "chat.send": "Send",
      "chat.online": "Online",
      "chat.offline": "Offline",

      // Profile
      "profile.title": "Profile",
      "profile.personalInfo": "Personal Information",
      "profile.notifications": "Notifications",
      "profile.language": "Language",
      "profile.theme": "Theme"
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.dashboard": "डैशबोर्ड",
      "nav.maintenance": "रखरखाव",
      "nav.history": "इतिहास",
      "nav.chat": "चैट",
      "nav.rent": "किराया",
      "nav.profile": "प्रोफ़ाइल",
      "nav.logout": "लॉग आउट",

      // Common
      "common.loading": "लोड हो रहा है...",
      "common.submit": "जमा करें",
      "common.cancel": "रद्द करें",
      "common.save": "सेव करें",
      "common.edit": "संपादित करें",
      "common.delete": "हटाएं",
      "common.confirm": "पुष्टि करें",
      "common.back": "वापस",
      "common.next": "अगला",
      "common.previous": "पिछला",

      // Dashboard
      "dashboard.welcome": "वापसी पर स्वागत है",
      "dashboard.openRequests": "खुले अनुरोध",
      "dashboard.completedRequests": "पूर्ण",
      "dashboard.pendingPayments": "लंबित भुगतान",
      "dashboard.recentActivity": "हाल की गतिविधि",

      // Maintenance
      "maintenance.newRequest": "नया अनुरोध",
      "maintenance.category": "श्रेणी",
      "maintenance.urgency": "तात्कालिकता",
      "maintenance.description": "विवरण",
      "maintenance.photos": "फोटो",
      "maintenance.submit": "अनुरोध जमा करें",
      "maintenance.status.pending": "लंबित",
      "maintenance.status.inProgress": "प्रगति में",
      "maintenance.status.completed": "पूर्ण",
      "maintenance.urgency.low": "कम",
      "maintenance.urgency.medium": "मध्यम",
      "maintenance.urgency.high": "उच्च",
      "maintenance.category.plumbing": "नलसाजी",
      "maintenance.category.electrical": "बिजली",
      "maintenance.category.general": "सामान्य"
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.dashboard": "Panel",
      "nav.maintenance": "Mantenimiento",
      "nav.history": "Historial",
      "nav.chat": "Chat",
      "nav.rent": "Alquiler",
      "nav.profile": "Perfil",
      "nav.logout": "Cerrar Sesión",

      // Common
      "common.loading": "Cargando...",
      "common.submit": "Enviar",
      "common.cancel": "Cancelar",
      "common.save": "Guardar",
      "common.edit": "Editar",
      "common.delete": "Eliminar",
      "common.confirm": "Confirmar",
      "common.back": "Atrás",
      "common.next": "Siguiente",
      "common.previous": "Anterior",

      // Dashboard
      "dashboard.welcome": "Bienvenido de vuelta",
      "dashboard.openRequests": "Solicitudes Abiertas",
      "dashboard.completedRequests": "Completadas",
      "dashboard.pendingPayments": "Pagos Pendientes",
      "dashboard.recentActivity": "Actividad Reciente"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
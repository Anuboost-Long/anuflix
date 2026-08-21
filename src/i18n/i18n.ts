import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "@/i18n/lang/en.json"
import kh from "@/i18n/lang/kh.json"

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: en
      },
      kh: {
        translation: kh
      }
    }
  })
}

export default i18n

import { type I18nLocale, i18nConfig } from "./i18nConfig";

export function getLocaleFromString(localeStr: string): I18nLocale {
    if (!i18nConfig.availableLocales.includes(localeStr as I18nLocale)) {
        return i18nConfig.defaultLocale;
    }
    if (localeStr.includes("-")) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const language = localeStr.split("-")[0]!;
        for (const availableLocale of i18nConfig.availableLocales) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const availableLocaleLanguage = availableLocale.split("-")[0]!;
            if (language === availableLocaleLanguage) {
                return availableLocale;
            }
        }
    }
    return localeStr as I18nLocale;
}

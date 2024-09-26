import { getRequestConfig } from "next-intl/server";
import { i18nConfig } from "./i18nConfig";
import { loadAllI18nMessages } from "./loadAllI18nMessages";

// eslint-disable-next-line import/no-default-export
export default getRequestConfig(async () => {
    // Just use the default locale until a 2nd locale is added
    const locale = i18nConfig.defaultLocale;

    return {
        locale,
        messages: await loadAllI18nMessages(locale),
    };
});

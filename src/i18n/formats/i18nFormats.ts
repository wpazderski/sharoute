import type { Formats } from "next-intl";
import { i18nDateTimeFormats } from "./i18nDateTimeFormats";
import { i18nListFormats } from "./i18nListFormats";
import { i18nNumberFormats } from "./i18nNumberFormats";

export const i18nFormats: Formats = {
    dateTime: i18nDateTimeFormats,
    list: i18nListFormats,
    number: i18nNumberFormats,
};

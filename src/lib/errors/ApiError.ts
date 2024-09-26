export type ApiErrorI18nKey = keyof IntlMessages["apiErrors"];

export class ApiError extends Error {
    constructor(public errorI18nKey: ApiErrorI18nKey) {
        super(`ApiError: ${errorI18nKey}`);
    }
}

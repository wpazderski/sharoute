import "next-auth/jwt";
import type { UserSignInExternalProviderAccountId, UserSignInExternalProviderId } from "./auth";
import type { AllI18nMessages } from "./i18n/loadAllI18nMessages";

declare global {
    interface IntlMessages extends AllI18nMessages {}
}

declare module "next-auth" {
    interface User {
        email: string;
    }

    interface Account {}

    interface Session {
        provider?: UserSignInExternalProviderId | undefined;
        providerAccountId?: UserSignInExternalProviderAccountId | undefined;
        userId?: string | undefined;
    }
}

declare module "next-auth/jwt" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface JWT {
        provider: string;
        providerAccountId: string;
    }
}

declare module "server-only";

/* eslint-disable no-param-reassign */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Opaque } from "./types";

export type UserSignInExternalProviderId = "google";

declare const _UserSignInExternalProviderAccountId: unique symbol;
export type UserSignInExternalProviderAccountId = Opaque<string, typeof _UserSignInExternalProviderAccountId>;

export const { handlers, signIn, signOut, auth } = NextAuth({
    theme: { colorScheme: "light" },
    session: {
        strategy: "jwt",
    },
    providers: [Google({})],
    callbacks: {
        signIn: ({ account, profile }) => {
            if (!account || profile?.email === undefined || profile.email === null) {
                return false;
            }
            if (!account.provider || !account.providerAccountId) {
                return false;
            }
            if (account.provider === "google") {
                if (profile.email_verified !== true) {
                    return false;
                }
            }
            return true;
        },
        jwt: ({ account, token }) => {
            if (account && account.provider !== "") {
                token.provider = account.provider;
                token.providerAccountId = account.providerAccountId;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token.provider) {
                session.provider = token.provider as UserSignInExternalProviderId;
                session.providerAccountId = token.providerAccountId as UserSignInExternalProviderAccountId;
            }
            return session;
        },
    },
});

export function getUserId(providerId: string, providerAccountId: string): string {
    return `${providerId}:${providerAccountId}`;
}

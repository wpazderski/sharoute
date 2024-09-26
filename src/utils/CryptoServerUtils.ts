import "server-only";
import crypto from "crypto";

export class CryptoServerUtils {
    static generateRandomHexString(length: number): string {
        return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length);
    }
}

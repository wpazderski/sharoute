import { MissingEnvVarError } from "./errors/MissingEnvVarError";
import { type LogLevel, logLevels } from "./logLevels";

export class Env {
    static get basePath(): string {
        return this.assertVarDefined("NEXT_PUBLIC_BASE_PATH", process.env["NEXT_PUBLIC_BASE_PATH"]);
    }

    static get appOrigin(): string {
        return this.assertVarDefined("NEXT_PUBLIC_APP_ORIGIN", process.env["NEXT_PUBLIC_APP_ORIGIN"]);
    }

    static get isDemoMode(): boolean {
        return this.isTruthy(process.env["NEXT_PUBLIC_IS_DEMO_MODE"]);
    }

    static get demoModeMaxRoutes(): number {
        return this.parseNumericValue(process.env["NEXT_PUBLIC_DEMO_MODE_MAX_ROUTES"], 3);
    }

    static get mongodbReplicaSet(): string {
        return this.assertVarDefined("MONGODB_REPLICA_SET", process.env["MONGODB_REPLICA_SET"]);
    }

    static get mongodbUri(): string {
        return this.assertVarDefined("MONGODB_URI", process.env["MONGODB_URI"]);
    }

    static get mongodbDbName(): string {
        return this.assertVarDefined("MONGODB_DB_NAME", process.env["MONGODB_DB_NAME"]);
    }

    static get authSecret(): string {
        return this.assertVarDefined("AUTH_SECRET", process.env["AUTH_SECRET"]);
    }

    static get authGoogleId(): string {
        return this.assertVarDefined("AUTH_GOOGLE_ID", process.env["AUTH_GOOGLE_ID"]);
    }

    static get authGoogleSecret(): string {
        return this.assertVarDefined("AUTH_GOOGLE_SECRET", process.env["AUTH_GOOGLE_SECRET"]);
    }

    static get mapboxAccessToken(): string {
        return this.assertVarDefined("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN", process.env["NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN"]);
    }

    static get isDevEnv(): boolean {
        return process.env.NODE_ENV === "development";
    }

    static get isProdEnv(): boolean {
        return process.env.NODE_ENV === "production";
    }

    static get logLevel(): LogLevel {
        const rawLogLevel = this.assertVarDefined("NEXT_PUBLIC_LOG_LEVEL", process.env["NEXT_PUBLIC_LOG_LEVEL"]);
        if (!logLevels.includes(rawLogLevel as LogLevel)) {
            throw new Error(`Invalid log level: ${rawLogLevel}`);
        }
        return rawLogLevel as LogLevel;
    }

    private static assertVarDefined(varName: string, varValue: string | undefined): string {
        if (typeof varValue === "undefined") {
            throw new MissingEnvVarError(varName);
        }
        return varValue;
    }

    private static isTruthy(str: string | undefined): boolean {
        if (str === undefined) {
            return false;
        }
        // eslint-disable-next-line no-param-reassign
        str = str.toLowerCase();
        return str === "true" || str === "1" || str === "yes" || str === "on" || str === "enabled" || str === "y";
    }

    private static parseNumericValue(str: string | undefined, defaultValue: number): number {
        const value = str === undefined ? Number.NaN : parseInt(str, 10);
        return Number.isNaN(value) ? defaultValue : value;
    }
}

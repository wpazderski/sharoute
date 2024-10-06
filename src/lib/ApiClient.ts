import type { CreateRouteRequest, CreateRouteResponse } from "@/app/api/route/create/types";
import type { DeleteRouteRequest, DeleteRouteResponse } from "@/app/api/route/delete/types";
import type { GetRouteForManagementResponse } from "@/app/api/route/getForManagement/types";
import type { UpdateRouteRequest, UpdateRouteResponse } from "@/app/api/route/update/types";
import { appRoutes, convertAppRoutePathToFullUrl } from "@/app/appRoutes";
import type { RoutePublicId } from "@/lib/db/collections/routes/types";
import { ApiError, type ApiErrorI18nKey } from "./errors/ApiError";

export class ApiClient {
    static async post<TRequestData, TResponseData>(url: string, requestData: TRequestData): Promise<TResponseData> {
        const res = await fetch(convertAppRoutePathToFullUrl(url), {
            method: "POST",
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });
        if (!res.ok) {
            const errorI18nKey = this.convertStatusCodeToI18nKey(res.status);
            throw new ApiError(errorI18nKey);
        }
        const responseData = (await res.json()) as TResponseData;
        return responseData;
    }

    static async get<TResponseData>(url: string): Promise<TResponseData> {
        const res = await fetch(convertAppRoutePathToFullUrl(url), {
            method: "GET",
            cache: "no-store",
        });
        if (!res.ok) {
            const errorI18nKey = this.convertStatusCodeToI18nKey(res.status);
            throw new ApiError(errorI18nKey);
        }
        const responseData = (await res.json()) as TResponseData;
        return responseData;
    }

    static async createRoute(requestData: CreateRouteRequest): Promise<CreateRouteResponse> {
        return await this.post<CreateRouteRequest, CreateRouteResponse>(appRoutes.api.route.create(), requestData);
    }

    static async getRouteForManagement(routePublicId: RoutePublicId): Promise<GetRouteForManagementResponse | null> {
        try {
            return await this.get<GetRouteForManagementResponse>(appRoutes.api.route.getForManagement({ routePublicId }));
        } catch (error) {
            if (error instanceof ApiError && error.errorI18nKey === "notFound") {
                return null;
            }
            throw error;
        }
    }

    static async getRouteForViewing(routePublicId: RoutePublicId): Promise<GetRouteForManagementResponse | null> {
        try {
            return await this.get<GetRouteForManagementResponse>(appRoutes.api.route.getForViewing({ routePublicId }));
        } catch (error) {
            if (error instanceof ApiError && error.errorI18nKey === "notFound") {
                return null;
            }
            throw error;
        }
    }

    static async updateRoute(requestData: UpdateRouteRequest): Promise<UpdateRouteResponse> {
        return await this.post<UpdateRouteRequest, UpdateRouteResponse>(appRoutes.api.route.update(), requestData);
    }

    static async deleteRoute(requestData: DeleteRouteRequest): Promise<DeleteRouteResponse> {
        return await this.post<DeleteRouteRequest, DeleteRouteResponse>(appRoutes.api.route.delete(), requestData);
    }

    private static convertStatusCodeToI18nKey(statusCode: number): ApiErrorI18nKey {
        let errorI18nKey: ApiErrorI18nKey = "unknownError";
        switch (statusCode) {
            case 400:
                errorI18nKey = "badRequest";
                break;
            case 401:
                errorI18nKey = "unauthorized";
                break;
            case 403:
                errorI18nKey = "unauthorized";
                break;
            case 404:
                errorI18nKey = "notFound";
                break;
            case 500:
                errorI18nKey = "internalServerError";
                break;
            default:
                errorI18nKey = "unknownError";
                break;
        }
        return errorI18nKey;
    }
}

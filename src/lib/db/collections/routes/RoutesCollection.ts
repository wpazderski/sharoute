import "server-only";
import type { Collection as MongoCollection } from "mongodb";
import { GeoComputations } from "@/lib/route/GeoComputations";
import { CryptoServerUtils } from "@/utils/CryptoServerUtils";
import { Collection } from "../../Collection";
import type { CollectionName, OnlyWithMongoId, WithoutAnyIds } from "../../types";
import { collectionNames } from "../collectionNames";
import type {
    BasicRouteData,
    PublicRoute,
    Route,
    RouteCreatedAtTimestamp,
    RouteDescription,
    RouteHasElevation,
    RouteId,
    RouteOwnerId,
    RoutePointDescription,
    RoutePointDistanceFromRouteStartMeters,
    RoutePointElevationMeters,
    RoutePointId,
    RoutePointLatitude,
    RoutePointLongitude,
    RoutePointName,
    RoutePublicId,
    RouteUpdatedAtTimestamp,
} from "./types";

export class RoutesCollection extends Collection<Route, RouteId> {
    protected static _instance: RoutesCollection | null = null;

    static getInstance(): RoutesCollection {
        if (this._instance === null) {
            this._instance = new RoutesCollection();
        }
        return this._instance;
    }

    generateRoutePublicId(): RoutePublicId {
        return CryptoServerUtils.generateRandomHexString(16) as RoutePublicId;
    }

    override getCollectionName(): CollectionName {
        return collectionNames.routes;
    }

    override async ensureInitialized(collection: MongoCollection<OnlyWithMongoId<Route>>): Promise<void> {
        await collection.createIndex({ publicId: 1 }, { unique: true });
    }

    async getBasicRoutesDataByOwnerId(ownerId: RouteOwnerId): Promise<BasicRouteData[]> {
        const collection = await this.getCollection();
        const dbObjects = (await collection
            .find(
                { ownerId },
                {
                    projection: {
                        _id: 1,
                        createdAtTimestamp: 1,
                        updatedAtTimestamp: 1,
                        publicId: 1,
                        ownerId: 1,
                        name: 1,
                        description: 1,
                        hasElevation: 1,
                    },
                },
            )
            .toArray()) as Array<OnlyWithMongoId<BasicRouteData>>;
        return dbObjects.map((dbObject) => {
            const { _id, ...rest } = dbObject;
            return {
                id: this.convertMongoObjectIdToCollectionObjectId(_id),
                ...rest,
            } as unknown as BasicRouteData;
        });
    }

    async getRoute(publicId: RoutePublicId): Promise<Route | null> {
        const collection = await this.getCollection();
        const dbObject = await collection.findOne({ publicId });
        return dbObject === null ? null : this.convertDbObjectToObject(dbObject);
    }

    async getPublicRoute(publicId: RoutePublicId): Promise<PublicRoute | null> {
        const collection = await this.getCollection();
        const dbObject = await collection.findOne({ publicId });
        return dbObject === null ? null : this.convertRouteToPublicRoute(this.convertDbObjectToObject(dbObject));
    }

    async createRouteFromMinimalData(minimalData: Pick<Route, "name" | "trackPoints" | "ownerId">): Promise<Route> {
        const startTrackPoint = minimalData.trackPoints[0];
        const endTrackPoint = minimalData.trackPoints[minimalData.trackPoints.length - 1];
        if (!startTrackPoint || !endTrackPoint || startTrackPoint === endTrackPoint) {
            throw new Error("Route must have at least 2 track points");
        }
        const now = Date.now();
        const insertableRoute: WithoutAnyIds<Route> = {
            ...minimalData,
            createdAtTimestamp: now as RouteCreatedAtTimestamp,
            updatedAtTimestamp: now as RouteUpdatedAtTimestamp,
            description: "" as RouteDescription,
            publicId: this.generateRoutePublicId(),
            hasElevation: true as RouteHasElevation,
            points: [
                {
                    id: crypto.randomUUID() as RoutePointId,
                    type: "routeStart",
                    name: "" as RoutePointName,
                    description: "" as RoutePointDescription,
                    distanceFromRouteStartMeters: 0 as RoutePointDistanceFromRouteStartMeters,
                    lat: startTrackPoint.lat as number as RoutePointLatitude,
                    lon: startTrackPoint.lon as number as RoutePointLongitude,
                    ele: startTrackPoint.ele as number as RoutePointElevationMeters,
                    photoIds: [],
                },
                {
                    id: crypto.randomUUID() as RoutePointId,
                    type: "routeEnd",
                    name: "" as RoutePointName,
                    description: "" as RoutePointDescription,
                    distanceFromRouteStartMeters: GeoComputations.getDistanceAlongPoints(minimalData.trackPoints) as RoutePointDistanceFromRouteStartMeters,
                    lat: endTrackPoint.lat as number as RoutePointLatitude,
                    lon: endTrackPoint.lon as number as RoutePointLongitude,
                    ele: endTrackPoint.ele as number as RoutePointElevationMeters,
                    photoIds: [],
                },
            ],
            photoIds: [],
        };
        const route = await this.insertOne(insertableRoute);
        return route;
    }

    protected convertRouteToPublicRoute(route: Route): PublicRoute {
        return {
            id: route.id,
            createdAtTimestamp: route.createdAtTimestamp,
            updatedAtTimestamp: route.updatedAtTimestamp,
            publicId: route.publicId,
            name: route.name,
            description: route.description,
            hasElevation: route.hasElevation,
            trackPoints: route.trackPoints,
            points: route.points,
            photoIds: route.photoIds,
        };
    }
}

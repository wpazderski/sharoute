import type { Document as MongoDocument, ObjectId } from "mongodb";
import type { Opaque } from "@/types";

declare const _CollectionName: unique symbol;
export type CollectionName = Opaque<string, typeof _CollectionName>;

export type OnlyWithMongoId<TObject extends MongoDocument> = Omit<TObject, "id"> & { _id: ObjectId };

export type WithoutAnyIds<TObject extends MongoDocument> = Omit<TObject, "_id" | "id">;

export type UpdateOneResult = { found: true; updated: true } | { found: false; updated: false } | { found: true; updated: false };

export interface UpdateManyResult {
    foundCount: number;
    updatedCount: number;
}

export type UpsertOneResult<TObjectId> =
    | { found: true; updated: true; inserted: false }
    | { found: false; updated: false; inserted: true; insertedId: TObjectId }
    | { found: true; updated: false; inserted: false };

export type UpsertManyResult<TObjectId> =
    | { foundCount: 0; updatedCount: 0; inserted: true; insertedId: TObjectId }
    | { foundCount: number; updatedCount: number; inserted: false };

export type ReplaceOneResult = { found: true; replaced: true } | { found: false; replaced: false } | { found: true; replaced: false };

export type ReplaceOneOrInsertResult<TObjectId> =
    | { found: true; replaced: true; inserted: false }
    | { found: false; replaced: false; inserted: true; insertedId: TObjectId }
    | { found: true; replaced: false; inserted: false };

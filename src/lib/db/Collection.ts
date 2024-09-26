/* eslint-disable @typescript-eslint/consistent-type-assertions */

import "server-only";
import {
    type ClientSession,
    type Filter,
    type MatchKeysAndValues,
    type Collection as MongoCollection,
    ObjectId,
    type OptionalUnlessRequiredId,
    type WithoutId,
} from "mongodb";
import { Deferred } from "@/utils/Deferred";
import { dbPromise } from "./dbPromise";
import type {
    CollectionName,
    OnlyWithMongoId,
    ReplaceOneOrInsertResult,
    ReplaceOneResult,
    UpdateManyResult,
    UpdateOneResult,
    UpsertManyResult,
    UpsertOneResult,
    WithoutAnyIds,
} from "./types";

export abstract class Collection<TObject extends { id: TObjectId }, TObjectId extends string> {
    private collectionDeferred: Deferred<MongoCollection<OnlyWithMongoId<TObject>>> | null = null;

    constructor() {}

    abstract getCollectionName(): CollectionName;

    abstract ensureInitialized(collection: MongoCollection<OnlyWithMongoId<TObject>>): Promise<void>;

    async getCollection(): Promise<MongoCollection<OnlyWithMongoId<TObject>>> {
        if (this.collectionDeferred === null) {
            this.collectionDeferred = new Deferred();
            const db = await dbPromise;
            const collection = db.collection<OnlyWithMongoId<TObject>>(this.getCollectionName());
            await this.ensureInitialized(collection);
            this.collectionDeferred.resolve(collection);
        }
        return await this.collectionDeferred.promise;
    }

    async getById(id: TObjectId, session?: ClientSession): Promise<TObject | null> {
        const collection = await this.getCollection();
        const dbObject = (await collection.findOne({ _id: new ObjectId(id) } as Filter<OnlyWithMongoId<TObject>>, {
            session,
        })) as OnlyWithMongoId<TObject> | null;
        if (dbObject === null) {
            return null;
        }
        return this.convertDbObjectToObject(dbObject);
    }

    async getByIds(ids: TObjectId[], session?: ClientSession): Promise<TObject[]> {
        const collection = await this.getCollection();
        const dbObjects = (await collection
            .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } } as Filter<OnlyWithMongoId<TObject>>, {
                session,
            })
            .toArray()) as Array<OnlyWithMongoId<TObject>>;
        return dbObjects.map((dbObject) => this.convertDbObjectToObject(dbObject));
    }

    async insertOne(obj: WithoutAnyIds<TObject>, session?: ClientSession): Promise<TObject> {
        const collection = await this.getCollection();
        const result = await collection.insertOne(obj as OptionalUnlessRequiredId<OnlyWithMongoId<TObject>>, { session });
        const clonedObj = structuredClone(obj);
        return {
            id: this.convertMongoObjectIdToCollectionObjectId(result.insertedId),
            ...clonedObj,
        } as TObject;
    }

    async insertMany(objs: Array<WithoutAnyIds<TObject>>, session?: ClientSession): Promise<TObject[]> {
        const collection = await this.getCollection();
        const result = await collection.insertMany(objs.map((obj) => structuredClone(obj)) as Array<OptionalUnlessRequiredId<OnlyWithMongoId<TObject>>>, {
            session,
        });
        const ret: TObject[] = [];
        for (const [index, insertedId] of Object.entries(result.insertedIds)) {
            const obj = objs[parseInt(index, 10)];
            if (obj === undefined) {
                continue;
            }
            ret.push({
                id: this.convertMongoObjectIdToCollectionObjectId(insertedId as ObjectId),
                ...obj,
            } as TObject);
        }
        return ret;
    }

    async updateOne(id: TObjectId, newProps: Partial<WithoutAnyIds<TObject>>, session?: ClientSession): Promise<UpdateOneResult> {
        const collection = await this.getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) } as Filter<OnlyWithMongoId<TObject>>,
            { $set: newProps as MatchKeysAndValues<OnlyWithMongoId<TObject>> },
            { session, upsert: false },
        );
        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            return { found: true, updated: true };
        }
        if (result.matchedCount === 0 && result.modifiedCount === 0) {
            return { found: false, updated: false };
        }
        if (result.matchedCount === 1 && result.modifiedCount === 0) {
            return { found: true, updated: false };
        }
        throw new Error(`Unexpected db.collection.updateOne() result: ${JSON.stringify(result)}`);
    }

    async updateMany(filter: Filter<OnlyWithMongoId<TObject>>, newProps: Partial<WithoutAnyIds<TObject>>, session?: ClientSession): Promise<UpdateManyResult> {
        const collection = await this.getCollection();
        const result = await collection.updateMany(filter, { $set: newProps as MatchKeysAndValues<OnlyWithMongoId<TObject>> }, { session, upsert: false });
        return {
            foundCount: result.matchedCount,
            updatedCount: result.modifiedCount,
        };
    }

    async upsertOne(id: TObjectId, newProps: WithoutAnyIds<TObject>, session?: ClientSession): Promise<UpsertOneResult<TObjectId>> {
        const collection = await this.getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) } as Filter<OnlyWithMongoId<TObject>>,
            { $set: newProps as MatchKeysAndValues<OnlyWithMongoId<TObject>> },
            { session, upsert: true },
        );
        if (result.matchedCount === 1 && result.modifiedCount === 1 && result.upsertedCount === 0) {
            return { found: true, updated: true, inserted: false };
        }
        if (result.matchedCount === 0 && result.modifiedCount === 0 && result.upsertedCount === 1 && result.upsertedId !== null) {
            const insertedId = this.convertMongoObjectIdToCollectionObjectId(result.upsertedId);
            return { found: false, updated: false, inserted: true, insertedId: insertedId };
        }
        if (result.matchedCount === 1 && result.modifiedCount === 0 && result.upsertedCount === 0) {
            return { found: true, updated: false, inserted: false };
        }
        throw new Error(`Unexpected db.collection.updateOne() result: ${JSON.stringify(result)}`);
    }

    async upsertMany(
        filter: Filter<OnlyWithMongoId<TObject>>,
        newProps: WithoutAnyIds<TObject>,
        session?: ClientSession,
    ): Promise<UpsertManyResult<TObjectId>> {
        const collection = await this.getCollection();
        const result = await collection.updateMany(filter, { $set: newProps as MatchKeysAndValues<OnlyWithMongoId<TObject>> }, { session, upsert: true });
        if (result.matchedCount > 0 && result.upsertedCount === 0) {
            return {
                foundCount: result.matchedCount,
                updatedCount: result.modifiedCount,
                inserted: false,
            };
        }
        if (result.matchedCount === 0 && result.modifiedCount === 0 && result.upsertedCount === 1 && result.upsertedId !== null) {
            return {
                foundCount: 0,
                updatedCount: 0,
                inserted: true,
                insertedId: this.convertMongoObjectIdToCollectionObjectId(result.upsertedId),
            };
        }
        throw new Error(`Unexpected db.collection.updateMany() result: ${JSON.stringify(result)}`);
    }

    async replaceOne(id: TObjectId, obj: WithoutAnyIds<TObject>, session?: ClientSession): Promise<ReplaceOneResult> {
        const collection = await this.getCollection();
        const result = await collection.replaceOne(
            { _id: new ObjectId(id) } as Filter<OnlyWithMongoId<TObject>>,
            obj as unknown as WithoutId<OnlyWithMongoId<TObject>>,
            { session, upsert: false },
        );
        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            return { found: true, replaced: true };
        }
        if (result.matchedCount === 0 && result.modifiedCount === 0) {
            return { found: false, replaced: false };
        }
        if (result.matchedCount === 1 && result.modifiedCount === 0) {
            return { found: true, replaced: false };
        }
        throw new Error(`Unexpected db.collection.replaceOne() result: ${JSON.stringify(result)}`);
    }

    async replaceOneOrInsert(id: TObjectId, obj: WithoutAnyIds<TObject>, session?: ClientSession): Promise<ReplaceOneOrInsertResult<TObjectId>> {
        const collection = await this.getCollection();
        const result = await collection.replaceOne(
            { _id: new ObjectId(id) } as Filter<OnlyWithMongoId<TObject>>,
            obj as unknown as WithoutId<OnlyWithMongoId<TObject>>,
            { session, upsert: true },
        );
        if (result.matchedCount === 1 && result.modifiedCount === 1 && result.upsertedCount === 0) {
            return { found: true, replaced: true, inserted: false };
        }
        if (
            result.matchedCount === 0 &&
            result.modifiedCount === 0 &&
            result.upsertedCount === 1 &&
            result.upsertedId !== null &&
            result.upsertedId instanceof ObjectId
        ) {
            const insertedId = this.convertMongoObjectIdToCollectionObjectId(result.upsertedId);
            return { found: false, replaced: false, inserted: true, insertedId: insertedId };
        }
        if (result.matchedCount === 1 && result.modifiedCount === 0 && result.upsertedCount === 0) {
            return { found: true, replaced: false, inserted: false };
        }
        throw new Error(`Unexpected db.collection.updateOne() result: ${JSON.stringify(result)}`);
    }

    async deleteById(id: TObjectId, session?: ClientSession): Promise<boolean> {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) } as Filter<OnlyWithMongoId<TObject>>, { session });
        return result.deletedCount === 1;
    }

    async deleteManyByIds(ids: TObjectId[], session?: ClientSession): Promise<number> {
        const collection = await this.getCollection();
        const result = await collection.deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } } as Filter<OnlyWithMongoId<TObject>>, { session });
        return result.deletedCount;
    }

    async findOne(filter: Filter<OnlyWithMongoId<TObject>>, session?: ClientSession): Promise<TObject | null> {
        const collection = await this.getCollection();
        const dbObject = (await collection.findOne(filter, { session })) as OnlyWithMongoId<TObject> | null;
        if (dbObject === null) {
            return null;
        }
        return this.convertDbObjectToObject(dbObject);
    }

    async findMany(filter: Filter<OnlyWithMongoId<TObject>>, session?: ClientSession): Promise<TObject[]> {
        const collection = await this.getCollection();
        const dbObjects = (await collection.find(filter, { session }).toArray()) as Array<OnlyWithMongoId<TObject>>;
        return dbObjects.map((dbObject) => this.convertDbObjectToObject(dbObject));
    }

    async count(filter: Filter<OnlyWithMongoId<TObject>>, session?: ClientSession): Promise<number> {
        const collection = await this.getCollection();
        return await collection.countDocuments(filter, { session });
    }

    convertObjectToDbObject(object: TObject): OnlyWithMongoId<TObject> {
        const { id: _id, ...rest } = object;
        return {
            _id: new ObjectId(_id),
            ...rest,
        } as unknown as OnlyWithMongoId<TObject>;
    }

    convertDbObjectToObject(dbObject: OnlyWithMongoId<TObject>): TObject {
        const { _id, ...rest } = dbObject;
        return {
            id: this.convertMongoObjectIdToCollectionObjectId(_id),
            ...rest,
        } as unknown as TObject;
    }

    convertMongoObjectIdToCollectionObjectId(mongoObjectId: ObjectId): TObjectId {
        return mongoObjectId.toHexString() as TObjectId;
    }
}

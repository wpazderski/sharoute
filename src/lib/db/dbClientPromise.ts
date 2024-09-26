import "server-only";
import type { MongoClientOptions } from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Env } from "@/utils/Env";

type GlobalWithMongo = typeof globalThis & {
    mongoClientPromise?: Promise<MongoClient>;
};

const uri = Env.mongodbUri;
const options: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    replicaSet: Env.mongodbReplicaSet,
};

async function getDbClientPromise(): Promise<MongoClient> {
    if (Env.isDevEnv) {
        const globalWithMongo = global as GlobalWithMongo;
        if (!globalWithMongo.mongoClientPromise) {
            globalWithMongo.mongoClientPromise = new MongoClient(uri, options).connect();
        }
        return await globalWithMongo.mongoClientPromise;
    } else {
        return await new MongoClient(uri, options).connect();
    }
}

export const dbClientPromise = getDbClientPromise();

import "server-only";
import { Env } from "@/utils/Env";
import { dbClientPromise } from "./dbClientPromise";

export const dbPromise = dbClientPromise.then((client) => client.db(Env.mongodbDbName));

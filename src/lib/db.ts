import dns from "node:dns";
import { MongoClient } from "mongodb";

// dns fix for srv lookup on local networks
if (process.env.NODE_ENV !== "production") dns.setServers(["8.8.8.8", "1.1.1.1"]);

const cs_uri = process.env.CS_MONGODB_URI;
if (!cs_uri) throw new Error("CS_MONGODB_URI is missing in .env.local");

// reuse one client across hot reloads
const cs_global = globalThis as unknown as { cs_mongoClient?: MongoClient };

export const cs_mongoClient = cs_global.cs_mongoClient ?? new MongoClient(cs_uri);
if (process.env.NODE_ENV !== "production") cs_global.cs_mongoClient = cs_mongoClient;

export const cs_db = cs_mongoClient.db(process.env.CS_DB_NAME || "studioSpaceDB");

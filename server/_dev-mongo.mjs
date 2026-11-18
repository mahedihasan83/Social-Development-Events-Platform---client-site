/**
 * Local dev database — lightweight MongoDB on port 27017.
 *
 * Runs as a single-node replica set ("rs0") because BetterAuth's MongoDB
 * adapter uses transactions, which require a replica set (a standalone
 * mongod rejects them with IllegalOperation).
 *
 * Runs until stopped; data lives for the duration of the process (fine for
 * development). When the Atlas credentials are fixed, switch server/.env
 * back to the Atlas URI and this is no longer needed.
 */
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = await MongoMemoryServer.create({
  instance: { port: 27017, ip: "127.0.0.1", dbName: "shohojog" },
  replSet: { count: 1, name: "rs0" },
});

console.log("[dev-mongo] Ready:", mongod.getUri());
console.log("[dev-mongo] Keep this window/process running while developing.");

// Keep the process alive.
setInterval(() => {}, 1 << 30);

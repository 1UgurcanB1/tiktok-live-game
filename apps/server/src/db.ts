import mongoose from "mongoose";
import { env } from "./env.js";

let memoryMode = false;

export async function connectMongo() {
  if (env.DATABASE_MODE === "memory") {
    memoryMode = true;
    console.warn("[db] DATABASE_MODE=memory, MongoDB connection skipped");
    return null;
  }

  memoryMode = false;
  await mongoose.connect(env.DATABASE_URL!, {
    autoIndex: env.NODE_ENV === "development",
    serverSelectionTimeoutMS: 10_000,
  });
  console.warn("[db] connected to MongoDB Atlas / MongoDB");
  return mongoose.connection;
}

export async function healthMongo() {
  if (memoryMode || env.DATABASE_MODE === "memory") {
    return { ok: true, state: 1, mode: "memory" as const };
  }

  const conn = mongoose.connection;
  if (conn.readyState !== 1) {
    try {
      await conn.asPromise();
    } catch (e) {
      return {
        ok: false,
        state: conn.readyState,
        mode: "mongo" as const,
        error: String(e),
      };
    }
  }

  try {
    const db = conn.db ?? conn.getClient().db();
    await db.admin().ping();
    return { ok: true, state: conn.readyState, mode: "mongo" as const };
  } catch (e) {
    return {
      ok: false,
      state: conn.readyState,
      mode: "mongo" as const,
      error: String(e),
    };
  }
}

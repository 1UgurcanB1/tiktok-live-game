import mongoose from "mongoose";
import { DATABASE_URL, NODE_ENV } from "./env.js";

export async function connectMongo() {
    if (!DATABASE_URL) throw new Error("DATABASE_URL not set");
    await mongoose.connect(DATABASE_URL, {
        autoIndex: NODE_ENV === "development",
    });
    return mongoose.connection;
}

export async function healthMongo() {
    const conn = mongoose.connection;

    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (conn.readyState !== 1) {
        try { await conn.asPromise(); } catch { }
    }

    try {
        const db = conn.db ?? conn.getClient().db();
        await db.admin().ping();
        return { ok: true, state: conn.readyState };
    } catch (e) {
        return { ok: false, state: conn.readyState, error: String(e) };
    }
}
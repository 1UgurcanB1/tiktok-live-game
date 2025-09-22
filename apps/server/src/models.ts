import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    raw: Object,
    createdAt: { type: Date, default: Date.now, index: true },
    expireAt: { type: Date, default: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }
}, { collection: "tiktok_chat" });

const GiftSchema = new mongoose.Schema({
    raw: Object,
    createdAt: { type: Date, default: Date.now, index: true }
}, { collection: "tiktok_gift" });

ChatSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const ChatModel = mongoose.model("Chat", ChatSchema);
export const GiftModel = mongoose.model("Gift", GiftSchema);


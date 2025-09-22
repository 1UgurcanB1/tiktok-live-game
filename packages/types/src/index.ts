export type IsoDateTime = string; // e.g. 2025-09-22T12:34:56.000Z


export type ClientToServerMessage =
    | { type: "ping"; payload?: unknown }
    | { type: "echo"; payload: unknown };


export type ServerToClientMessage =
    | { type: "welcome"; timestamp: IsoDateTime }
    | { type: "pong"; timestamp: IsoDateTime }
    | { type: "broadcast"; payload: unknown; timestamp: IsoDateTime };
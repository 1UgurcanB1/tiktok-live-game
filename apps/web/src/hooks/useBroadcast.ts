import { useEffect } from "react";
import { type ServerEvent, events } from "../services/ws";

export function useBroadcast<T extends ServerEvent = ServerEvent>(
  type: T["type"],
  handler: (e: T) => void,
) {
  useEffect(() => events.on(type, handler), [type, handler]);
}

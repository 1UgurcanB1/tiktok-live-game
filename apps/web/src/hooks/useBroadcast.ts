import { useEffect } from "react";
import { events, type ServerEvent } from "../services/ws";

export function useBroadcast<T extends ServerEvent = ServerEvent>(
  type: T["type"],
  handler: (e: T) => void,
) {
  useEffect(() => {
    return events.on(type, handler);
  }, [type, handler]);
}

import { useSyncExternalStore } from "react";
import type { RoomInfo, RoomInfoResponse } from "~/lib/types/roomInfo";

let infoStore: RoomInfo[] = [];
const listeners = new Set<() => void>();

const getInfo = () => {
  return infoStore;
};
const subStore = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const undateInfo = (msg: RoomInfo[]) => {
  infoStore = msg;
  listeners.forEach((listener) => listener());
};

const undateCount = (msg: RoomInfoResponse) => {
  const room = infoStore.find((info) => info["room-id"] == msg.id);
  if (room == undefined) return;
  room.count += msg.status;
  room.userList[msg.userName] = msg.status;
  infoStore = [...infoStore];
  listeners.forEach((listener) => listener());
};

export const useInfo = () =>
  useSyncExternalStore(subStore, getInfo, () => infoStore);

export const connectWebSocket = (
  url: string,
  {
    openCb = () => {},
    messageCb = () => {},
    closeCb = () => {},
    errCb = () => {},
  }: {
    openCb?: ((this: WebSocket, ev: Event) => any | null) | (() => void);
    messageCb?: () => void;
    closeCb?: ((this: WebSocket, ev: CloseEvent) => any | null) | (() => void);
    errCb?: ((this: WebSocket, ev: Event) => any | null) | (() => void);
  } = {}
) => {
  const ws = new WebSocket(url);

  ws.onopen = openCb;

  ws.onmessage = ({ data }) => {
    messageCb();
    const newInfo = JSON.parse(data) as RoomInfo[] | RoomInfoResponse;
    if (typeof newInfo !== "object") return;

    if (Array.isArray(newInfo)) {
      if (
        newInfo.length == 0 &&
        newInfo[(Math.random() * newInfo.length) | 0]?.["room-id"] == undefined
      )
        return;

      undateInfo(newInfo);
      return;
    }

    if (
      newInfo?.id == undefined ||
      newInfo?.status == undefined ||
      newInfo?.userName == undefined
    )
      return;
    undateCount(newInfo);
  };

  ws.onclose = closeCb;
  ws.onerror = errCb;

  return ws;
};

export default useInfo;

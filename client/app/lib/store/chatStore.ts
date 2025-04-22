import { useSyncExternalStore } from "react";
import type { chatResponse } from "~/lib/types/chat";

let msgStore: chatResponse[] = [];
const listeners = new Set<() => void>();

const getMsgStore = () => msgStore;

const subStore = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useChatInfo = () =>
  useSyncExternalStore(subStore, getMsgStore, () => msgStore);

export const addMsg = (msg: chatResponse) => {
  msgStore = [...msgStore, msg];
  listeners.forEach((listener) => listener());
};

export const clearMsg = () => {
  msgStore = [];
  listeners.forEach((listener) => listener());
};

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
  }
) => {
  const ws = new WebSocket(url);
  ws.onopen = openCb;

  ws.onmessage = ({ data }) => {
    messageCb();
    const newInfo = JSON.parse(data) as chatResponse;
    if (typeof newInfo !== "object") return;
    if (!newInfo?.userName || newInfo.userName === "") return;
    if (
      !newInfo?.content ||
      newInfo.content === "" ||
      newInfo.content.length > 100
    )
      return;
    if (!newInfo?.date || newInfo.date < 0) return;

    addMsg(newInfo);
  };

  ws.onclose = closeCb;
  ws.onerror = errCb;

  return ws;
};

export default useChatInfo;

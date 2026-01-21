import { useSyncExternalStore } from "react";
import { ChatMsg } from "../types/chatMsg";

const store: ChatMsg[] = [];
let listeners: (() => void)[] = [];

const getStore = () => store;

const subscribe = (listener: () => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const addChatMsg = (message: ChatMsg) => {
  store.push(message);
  listeners.forEach((listener) => listener());
};

const useChatStore = () => useSyncExternalStore(subscribe, getStore, () => []);

export { useChatStore, addChatMsg };

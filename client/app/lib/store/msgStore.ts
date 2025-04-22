import { useSyncExternalStore } from "react";

export type MsgType = {
  type: "tip" | "error" | "success";
  msg: string;
  id: string | number;
};

let msgList: MsgType[] = [];
const listeners = new Set<() => void>();

const getMsgList = () => msgList;
const subStore = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useMsg = () => useSyncExternalStore(subStore, getMsgList, () => msgList);

const deleteMsg = (id: string | number) => {
  msgList = msgList.filter((i) => i.id !== id);
  listeners.forEach((listener) => listener());
};

export const addMsg = (msg: { type: MsgType["type"]; msg: MsgType["msg"] }) => {
  const id = Date.now();
  msgList = [
    ...msgList,
    {
      ...msg,
      id,
    },
  ];
  setTimeout(() => deleteMsg(id), 3000);
  listeners.forEach((listener) => listener());
};

export default useMsg;

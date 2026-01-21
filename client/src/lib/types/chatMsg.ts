import { UserSessionInfo } from "./user";

export type ChatMsg = {
  id: string;
  type: "text" | "image" | "audio" | "video" | "file";
  content: string;
  sender: UserSessionInfo;
  createdAt: Date;
};

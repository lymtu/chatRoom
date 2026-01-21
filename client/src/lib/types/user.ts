export interface User {
  id: string;
  name: string;
  email?: string;
  password: string;
  salt: string;
  role: "user" | "admin";
  status: 0 | 1; // 0: ban, 1: unban
  avatarUrl: string;
}

export type UserSessionInfo = Omit<User, "password" | "salt" | "status">;
/**
 * {
 *   id: string;
 *   name: string;
 *   email?: string;
 *   role: "user" | "admin";
 *   avatarUrl: string;
 }
 */

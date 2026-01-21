"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Response } from "../types/response";
import { UserSessionInfo } from "../types/user";

export type AuthContextUserInfo = {
  id: string;
  name: string;
  email?: string;
  token: string;
  role: "user" | "admin";
  avatarUrl: string;
};

type AuthContextType = {
  userInfo: AuthContextUserInfo | null;
  enter: (userInfo: AuthContextUserInfo) => void;
  exit: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  enter: () => {},
  exit: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<AuthContextUserInfo | null>(null);

  const oauth = useCallback((token: string) => {
    fetch("/api/auth/oauth?token=" + token)
      .then((res) => res.json())
      .then((res: Response<UserSessionInfo>) => {
        if (res.code !== 200 || !res.data?.name) {
          return;
        }

        setUserInfo({
          ...res.data,
          avatarUrl: res.data.avatarUrl ?? "/autoAvatar.png",
          token,
        });
      });
  }, []);

  const signOutRequest = useCallback((token: string) => {
    fetch("/api/auth/signOut?token=" + token)
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 200) {
          return;
        }

        setUserInfo(null);
        localStorage.removeItem("token");
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      oauth(token);
    }
  }, [oauth]);

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        enter: (userInfo) => {
          localStorage.setItem("token", userInfo.token);
          setUserInfo(userInfo);
        },
        exit: () => {
          if (userInfo?.token) signOutRequest(userInfo?.token);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import type { Route } from "./+types/index";

import { Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import authCookie from "~/lib/cookie/authCookie.server";
import { connectWebSocket } from "~/lib/store/roomInfoStore";

import type { RoomInfoResponse, RoomInfoRequest } from "~/lib/types/roomInfo";

type LoaderDataType = {
  isAuth: boolean | string;
  WEBSERVER_URL: string;
};

export const loader = async ({ request }: { request: Request }) => {
  const result: LoaderDataType = {
    isAuth: false,
    WEBSERVER_URL: process.env.WSS_URL_ROOM_INFO ?? "ws://localhost:2999",
  };
  const cookie = request.headers.get("Cookie");
  const auth = await authCookie.parse(cookie ?? "");

  result.isAuth = auth;
  return result;
};

export default function Index({ loaderData }: Route.ComponentProps) {
  if (!loaderData.isAuth) {
    return <Outlet />;
  }

  const location = useLocation();
  const wsRef = useRef<WebSocket | null>(null);
  const lastLocationRef = useRef<string>(location.pathname);

  useEffect(() => {
    if (wsRef.current) {
      return;
    }
    wsRef.current = connectWebSocket(loaderData.WEBSERVER_URL);
  }, []);

  useEffect(() => {
    if (location.pathname == lastLocationRef.current) return;
    let id: string;

    if (
      location.pathname == "/select" &&
      lastLocationRef.current.includes("/select/")
    ) {
      // out room
      id = lastLocationRef.current.split("/").pop() as string;
      wsRef.current?.send(
        JSON.stringify({
          id,
          userName: loaderData.isAuth,
          status: -1,
        } as RoomInfoRequest)
      );
    } else if (
      location.pathname.includes("/select/") &&
      lastLocationRef.current == "/select"
    ) {
      // in room
      id = location.pathname.split("/").pop() as string;
      wsRef.current?.send(
        JSON.stringify({
          id,
          userName: loaderData.isAuth,
          status: 1,
        } as RoomInfoRequest)
      );
    }
    lastLocationRef.current = location.pathname;

    const sendLastMsg = () => {
      wsRef.current?.send(
        JSON.stringify({
          id,
          name: loaderData.isAuth,
          status: -1,
        })
      );
    };
    window.addEventListener("unload", sendLastMsg);
    return () => {
      window.removeEventListener("unload", sendLastMsg);
    };
  }, [location]);

  return <Outlet />;
}

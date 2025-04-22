import type { Route } from "./+types/[id]";
import authCookie from "~/lib/cookie/authCookie.server";

import { Form, redirect } from "react-router";
import { addMsg } from "~/lib/store/msgStore";
import { useMemo, useEffect, useRef } from "react";
import { useInfo } from "~/lib/store/roomInfoStore";
import { clearMsg, connectWebSocket, useChatInfo } from "~/lib/store/chatStore";

import Header from "~/routes/select/components/[id]/header";
import Msg from "~/routes/select/components/[id]/msg";
import UserList from "~/routes/select/components/[id]/userList";
import type { chatRequset } from "~/lib/types/chat";

export function meta() {
  return [{ title: "room" }];
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const cookie = request.headers.get("Cookie");
  const auth = await authCookie.parse(cookie ?? "");

  if (!auth) {
    return "Unauthorized";
  }

  return {
    isAuth: auth,
    id: params.id,
  };
};

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const serverLoaderData = await serverLoader();

  if (typeof serverLoaderData === "string") {
    addMsg({
      type: "error",
      msg: serverLoaderData,
    });
    return redirect("/select");
  }

  return {
    ...serverLoaderData,
  };
};

export const clientAction = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { content } = Object.fromEntries(formData) as { content: string };
  if (content === "" || content.length > 100) {
    addMsg({
      type: "error",
      msg: "Invalid message",
    });
    return;
  }

  return { content };
};

// resolve refresh
clientLoader.hydrate = true as const;

export default function RoomItem({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  if (!loaderData || typeof loaderData === "string") {
    return;
  }
  const { isAuth, id } = loaderData;
  const wsRef = useRef<WebSocket | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const infoStore = useInfo();
  const chatInfo = useChatInfo();
  const info = useMemo(() => {
    return infoStore.filter((i) => i["room-id"] === id)[0];
  }, [infoStore]);

  useEffect(() => {
    if (wsRef.current) return;
    wsRef.current = connectWebSocket(info["wss-url"], {
      messageCb: () => {
        setTimeout(() => {
          containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
        });
      },
      closeCb: () => {
        clearMsg();
      },
    });

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!actionData) {
      return;
    }

    if (actionData.content === "") {
      addMsg({
        type: "error",
        msg: "Invalid message",
      });
      return;
    }

    if ([undefined, -1].includes(info.userList?.[isAuth])) {
      addMsg({
        type: "error",
        msg: "You are not in the room",
      });
      wsRef.current?.close();
      redirect("/select");
      return;
    }

    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      addMsg({
        type: "error",
        msg: "WebSocket is not open",
      });
      redirect("/select");
      return;
    }

    wsRef.current?.send(
      JSON.stringify({
        date: Date.now(),
        content: actionData.content,
        userName: isAuth,
      } as chatRequset)
    );
    (document.getElementById("room-content") as HTMLInputElement).value = "";
  }, [actionData]);

  return (
    <div className="flex bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
      <div className="mx-auto w-full sm:w-2xl lg:w-xl xl:w-3xl 2xl:w-5xl bg-gray-50 dark:bg-gray-900 duration-150">
        <div className="h-screen w-full flex flex-col border-x-2 duration-150 border-gray-200 dark:border-gray-700">
          <Header roomName={info["room-name"]} className="flex-initial" />
          <Msg
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar"
            info={chatInfo}
            auth={isAuth}
            ref={containerRef}
          />
          <TextArea className="flex-initial" />
        </div>
      </div>
      <UserList
        maxCount={20}
        userList={info.userList}
        userCount={info.count}
        className={
          "h-screen hidden lg:block lg:w-sm 2xl:w-md bg-gray-50 dark:bg-gray-900 duration-150"
        }
      />
    </div>
  );
}

function TextArea({ className }: { className?: string }) {
  return (
    <Form method="post" className={"relative px-4 xl:px-0 " + className}>
      <textarea
        className="outline-0 resize-none w-full h-28 xl:h-40 p-4 border-t-2 border-gray-200 dark:border-gray-700 duration-150 text-gray-900 placeholder:text-gray-500 dark:text-gray-100"
        name="content"
        id="room-content"
        placeholder="Type your message here..."
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        className="absolute bottom-0 right-0 xl:text-xl -translate-1/2 px-2 py-1 rounded-md bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 duration-150 text-white"
      >
        Send
      </button>
    </Form>
  );
}

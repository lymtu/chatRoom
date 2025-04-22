import useMsg, { type MsgType } from "~/lib/store/msgStore";
import { useEffect, useRef } from "react";

import style_fade_in from "~/assets/css/fade-in.module.css";
import style_fade_out from "~/assets/css/fade-out.module.css";

export default function Msg({ className }: { className?: string }) {
  const msgContainerDom = useRef<HTMLDivElement>(null);
  const oldMsgList = useRef<MsgType[]>([]);
  const msgList = useMsg();

  useEffect(() => {
    if (oldMsgList.current.length < msgList.length) {
      setTimeout(() => {
        msgContainerDom.current?.children[0].classList.add(
          style_fade_out["fade-out-to-right-top"]
        );
      }, 2750);
    }

    oldMsgList.current = msgList;
  }, [msgList]);
  return (
    <div
      className={
        className +
        " px-6 py-2 overflow-hidden z-50" +
        (msgList.length == 0 && " hidden")
      }
      ref={msgContainerDom}
    >
      {msgList.map((i) => {
        let bgColor = "";
        switch (i.type) {
          case "tip":
            bgColor = "bg-amber-100 dark:bg-amber-200";
            break;
          case "error":
            bgColor = "bg-red-100 dark:bg-red-200";
            break;
          case "success":
            bgColor = "bg-green-100 dark:bg-green-200";
            break;
        }
        return (
          <div
            key={i.id}
            className={
              "p-2 not-first:mt-4 cursor-pointer rounded-lg shadow text-amber-700 indent-6 duration-150 " +
              bgColor +
              " " +
              style_fade_in["fade-in-form-right-bottom"]
            }
          >
            {i.msg}
          </div>
        );
      })}
    </div>
  );
}

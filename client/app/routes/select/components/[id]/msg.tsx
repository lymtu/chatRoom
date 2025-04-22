import type { chatResponse } from "~/lib/types/chat";
import timeTransform from "~/lib/utils/timeTransform";
import style from "~/assets/css/fade-in.module.css";

export default function Msg({
  auth,
  className,
  info,
  ref,
}: {
  auth: string;
  className?: string;
  info: chatResponse[];
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  if (!auth) return;

  return (
    <div className={className} ref={ref}>
      <div className="h-fit py-6 flex gap-6 flex-col justify-end">
        {info.map((i) => (
          <div
            key={i.date + i.userName}
            className={
              "relative flex " +
              (i.userName === auth
                ? "flex-row-reverse origin-right items-end " +
                  style["fade-in-form-right-bottom"]
                : "origin-left " + style["fade-in-form-left-bottom"])
            }
          >
            <div className="truncate text-center w-20 p-2 mb-auto">
              {i.userName}
            </div>
            <div
              className={
                "relative after:absolute after:top-0 after:block after:h-full after:w-0.5 after:duration-150 after:bg-gray-200 dark:after:bg-gray-700 " +
                (i.userName === auth ? "after:right-0" : "after:left-0")
              }
            >
              <section className="text-2xl w-fit sm:max-w-md lg:max-w-2xl 2xl:w-3xl overflow-hidden wrap-break-word indent-6">
                {i.content}
              </section>
              <div
                className={
                  "text-xs mt-1 pt-1 border-t-2 duration-150 border-gray-200 dark:border-gray-700 " +
                  (i.userName === auth ? "text-right pr-2" : "pl-2")
                }
              >
                {timeTransform(i.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router";
import type { RoomInfo } from "~/lib/types/roomInfo";
export default function RoomInfoContainer({ info }: { info: RoomInfo[] }) {
  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center gap-2">
      {info.map((i) => (
        <div
          key={i["room-id"]}
          className={
            "md:w-2/3 flex items-center gap-4 justify-between text-nowrap p-4 duration-150 text-white shadow rounded " +
            (i["room-status"] === 1
              ? " bg-green-400 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-700"
              : "bg-amber-400 dark:bg-amber-600 hover:bg-amber-500 dark:hover:bg-amber-700")
          }
        >
          <span className="w-32 truncate text-center text-2xl">
            {i["room-name"]}
          </span>
          <span className="text-nowrap text-sm">user count: {i.count}</span>
          {i["room-status"] === 1 ? (
            <Link
              to={`/select/${i["room-id"]}`}
              className="py-1 px-2 rounded-xl duration-150 hover:bg-green-600"
            >
              Join -&gt;
            </Link>
          ) : (
            <div className="cursor-not-allowed py-1 px-2 rounded-xl duration-150 hover:bg-amber-600">
              Join -&gt;
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

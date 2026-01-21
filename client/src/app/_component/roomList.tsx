import Link from "next/link";
import roomList from "@/lib/utils/roomDbCache";

export async function RoomList() {
  return (
    <div>
      {roomList.map((room, index) => (
        <Link href={`/room/${room.id}`} key={room.id}>
          <div
            className={
              "p-2 w-full shadow dark:shadow-white/25 rounded-md cursor-pointer " +
              [
                "text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800",
                "text-white bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800",
                "bg-white hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900",
              ][index]
            }
          >
            {room.name}
          </div>
        </Link>
      ))}
    </div>
  );
}

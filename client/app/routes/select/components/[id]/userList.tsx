import type { RoomInfo } from "~/lib/types/roomInfo";

export default function UserList({
  userCount,
  maxCount,
  userList,
  className,
}: {
  userCount: RoomInfo["count"];
  maxCount: number;
  userList: RoomInfo["userList"];
  className?: string;
}) {
  const nameList: (keyof RoomInfo["userList"])[] = [];
  if (userCount > maxCount) {
    for (const name in userList) {
      if (userList[name] === 1) {
        nameList.push(name);
      }

      if (nameList.length >= maxCount) {
        break;
      }
    }
  } else {
    nameList.push(...Object.keys(userList).filter((i) => userList[i] === 1));
  }

  return (
    <div
      className={
        "border-l-2 duration-150 border-gray-200 dark:border-gray-700 " +
        className
      }
    >
      <div className="h-16 border-b-2 border-inherit">
        <div className="h-full flex items-center px-4 py-2 gap-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            User List
          </h2>
          <span className="text-blue-400 dark:text-blue-500">{userCount}</span>
        </div>
      </div>
      <ul className="h-[calc(100vh-4rem)]">
        {nameList.map((i) => (
          <li
            className="mx-4 p-2 not-last:border-b-2 border-gray-200 dark:border-gray-700"
            key={i}
          >
            {i}
          </li>
        ))}
        {userCount > maxCount && <li className="mx-4 p-2">...</li>}
      </ul>
    </div>
  );
}

import { Room } from "@/lib/types/room";
import dbCollectionName from "@/lib/utils/dbCollectionName";
import { find } from "@/lib/utils/mongodb";

let list: Room[] = [];

try {
  list = (await find(dbCollectionName.ROOMS, {
    project: {
      _id: 0,
    },
  })) as Room[];
} catch (error) {
  console.log(error);
}

const cahce: Record<Room["id"], Room> = {};

list.map((room) => {
  cahce[room.id] = room;
});

export function getRoomById(id: Room["id"]) {
  return cahce[id];
}
export default Object.freeze([...list]);

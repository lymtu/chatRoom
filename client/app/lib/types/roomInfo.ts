type UserName = string;
type Status = 1 | -1;

export type RoomInfo = {
  "room-id": string;
  "room-status": 0 | 1;
  "room-name": string;
  "wss-url": string;
  count: number;
  userList: Record<UserName, Status>;
};

export type RoomInfoRequest = {
  id: RoomInfo["room-id"];
  status: Status;
  userName: UserName;
};

export type RoomInfoResponse = {
  id: RoomInfo["room-id"];
  status: Status;
  userName: string;
};

import type { Route } from "./+types/select";

import authCookie from "~/lib/cookie/authCookie.server";
import Info from "~/routes/select/components/select/authInfoContainer";
import { useInfo } from "~/lib/store/roomInfoStore";
import type { RoomInfo } from "~/lib/types/roomInfo";
import RoomInfoContainer from "~/routes/select/components/select/roomInfoContainer";

export function meta({}: Route.MetaArgs) {
  return [{ title: "select room" }];
}

type LoaderDataType = {
  isAuth: boolean | string;
};

export const loader = async ({ request }: { request: Request }) => {
  const result: LoaderDataType = {
    isAuth: false,
  };
  const cookie = request.headers.get("Cookie");
  const auth = await authCookie.parse(cookie ?? "");

  result.isAuth = auth;
  return result;
};

export default function Select({ loaderData }: Route.ComponentProps) {
  const { isAuth } = loaderData;
  const info = useInfo() as RoomInfo[];
  return (
    <div className="flex flex-col md:flex-row justify-around items-center h-screen">
      <Info isAuth={isAuth} />
      <RoomInfoContainer info={info} />
    </div>
  );
}

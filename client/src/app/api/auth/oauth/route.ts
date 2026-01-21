import { getUserSession } from "@/lib/session/userSession";
import responseStore from "@/lib/utils/responseStore";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(responseStore[401]("Token not found"));
  }

  const info = await getUserSession(token);

  return Response.json({
    code: 200,
    data: info,
  });
}

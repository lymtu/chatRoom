import { redirect } from "react-router";
import { update } from "~/lib/utils/mongodb.server";
import { isOrigin } from "~/lib/utils/authOfRequest.server";

export const loader = async ({ request }: { request: Request }) => {
  const isOriginResult = isOrigin(request);
  if (!isOriginResult) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const name = new URL(request.url).searchParams.get("name");
  const update_result = await update(
    process.env.DB_USER_NAME ?? "user",
    { name },
    {
      $set: {
        status: 0,
      },
    }
  );

  if (update_result.matchedCount !== 1) {
    return "User not found";
  }

  return redirect("/", {
    status: 302,
    headers: {
      "Set-Cookie": `auth=;Expires=${Date.now() - 1};path=/;`,
    },
  });
};

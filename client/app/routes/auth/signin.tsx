import type { Route } from "../+types/home";

import authCookie from "~/lib/cookie/authCookie.server";
import { update } from "~/lib/utils/mongodb.server";
import { addMsg } from "~/lib/store/msgStore";

import { Form, Link } from "react-router";
import LabelBox from "~/routes/auth/components/labelBox";
import style_fade_in from "~/assets/css/fade-in.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "sign in" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { name, password, remember } = Object.fromEntries(formData);
  if (!name || !password) {
    return "name or password is empty";
  }

  const result_update = await update(
    process.env.DB_USER_NAME ?? "user",
    {
      name,
      password,
    },
    {
      $set: {
        status: 1,
      },
    }
  );

  if (!result_update.matchedCount) {
    return "password or name is wrong";
  }

  return new Response("ok", {
    headers: {
      "Set-Cookie": await authCookie.serialize(name, {
        maxAge: remember == "on" ? 60 * 60 * 24 * 400 : undefined,
      }),
    },
  });
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const result = await serverAction();
  if (!result) {
    return;
  }

  if (result === "ok") {
    addMsg({
      type: "success",
      msg: "sign in success, redirecting to select page...",
    });
    setTimeout(() => {
      location.href = "/select";
    }, 500);

    return;
  }

  addMsg({
    type: "tip",
    msg: result,
  });
  return;
}

export default function SignIn({}: Route.ComponentProps) {
  return (
    <Form
      method="post"
      className={"mt-6 " + style_fade_in["fade-in-form-left"]}
    >
      <div className="flex flex-col gap-5">
        <LabelBox type="text" name="name" content="user name: " />
        <LabelBox type="password" name="password" content="password: " />
      </div>

      <div className="my-10 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <input id="remember" type="checkbox" name="remember" />
          <label
            htmlFor="remember"
            className="w-fit text-sm flex items-center gap-2 select-none"
          >
            Remember me
          </label>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Link to={"/"} className="hover:text-blue-500 duration-150">
          back Home
        </Link>
        <button
          type="submit"
          className=" bg-blue-500 text-white py-2 px-6 rounded-lg cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </Form>
  );
}

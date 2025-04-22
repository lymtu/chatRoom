import type { Route } from "../+types/home";

import authCookie from "~/lib/cookie/authCookie.server";
import { find, insert } from "~/lib/utils/mongodb.server";
import { addMsg } from "~/lib/store/msgStore";
import { Form, Link } from "react-router";
import LabelBox from "~/routes/auth/components/labelBox";
import style_fade_in from "~/assets/css/fade-in.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "sign up" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const {
    name,
    password,
    "password-confirm": passwordConfirm,
    remember,
  } = Object.fromEntries(formData);

  if (!name || !password || !passwordConfirm) {
    return "Please fill in all fields";
  }

  if (password !== passwordConfirm) {
    return "Password confirm is not match";
  }

  const result_find = await find(process.env.DB_USER_NAME ?? "user", {
    filter: { name },
    project: { name: 1 },
  });

  if (result_find?.length != 0) {
    return "user name already exists";
  }

  const msg_insert = await insert(process.env.DB_USER_NAME ?? "user", {
    name,
    password,
    status: 0,
  });

  if (msg_insert?.acknowledged == undefined || !msg_insert.acknowledged) {
    return "server error";
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
  const result = (await serverAction()) as unknown as "ok" | undefined;
  if (!result) {
    return;
  }

  if (result === "ok") {
    addMsg({
      type: "success",
      msg: "sign up success, redirecting to select page...",
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

export default function SignUp() {
  return (
    <Form
      method="post"
      className={"mt-6 " + style_fade_in["fade-in-form-right"]}
    >
      <div className="flex flex-col gap-5">
        <LabelBox type="text" name="name" content="user name: " />
        <LabelBox type="password" name="password" content="password: " />
        <LabelBox
          type="password"
          name="password-confirm"
          content="Confirm password: "
        />
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

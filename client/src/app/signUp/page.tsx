"use client";

import { MyLink } from "@/components/global/myLink";
import Eye from "@/components/svg/eye";
import LockSvg from "@/components/svg/lock";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";

import { useActionState, useCallback, useState } from "react";
import { useAuth } from "@/lib/context/auth";

import serverAction from "./serverAction";
import digestPwd from "@/lib/utils/digestPwd";
import { useRouter } from "next/navigation";
import { UserInfoFormTemplate } from "../_component/userInfoForm";
import { ActionState } from "@/lib/types/actionState";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { enter } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const action = useCallback(
    async (state: ActionState, data: FormData) => {
      const pwd = String(data.get("password"));
      const encryptedPwd = await digestPwd(pwd);
      data.set("password", encryptedPwd);

      const res = await serverAction(data);
      if (res?.code !== 200) {
        return {
          error: true,
          message: res?.message || "未知错误",
        };
      }
      enter(res.data);
      setTimeout(() => {
        router.push("/");
      }, 500);
      return {
        error: false,
        message: "注册成功",
      };
    },
    [router, enter]
  );

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    null,
    "/signIn"
  );

  return (
    <main className="min-h-screen flex items-center">
      <UserInfoFormTemplate
        formAction={formAction}
        isPending={isPending}
        title="注册"
      >
        <InputGroup>
          <InputGroupAddon>
            <LockSvg size={18} />
          </InputGroupAddon>
          <InputGroupInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
            minLength={8}
            type={showPassword ? "text" : "password"}
            placeholder="输入您的密码"
          />
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Eye open={showPassword} size={20} />
          </InputGroupAddon>
        </InputGroup>

        <hr />

        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder="输入您的邮箱（可选）"
          />
        </InputGroup>

        <section>
          <p className="text-sm">
            有账号？去
            <MyLink href="/signIn">登录</MyLink>
          </p>
          <p
            className={
              "text-sm text-center mt-2 " +
              (state?.error ? "text-red-500" : "text-green-500")
            }
          >
            {state?.message}
          </p>
        </section>
      </UserInfoFormTemplate>
    </main>
  );
}

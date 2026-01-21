"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuth } from "@/lib/context/auth";
import { UserSessionInfo } from "@/lib/types/user";
import { useActionState, useCallback, useState } from "react";
import { UserInfoFormTemplate } from "../_component/userInfoForm";
import { MailIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarSvg from "@/components/svg/avatar";

import type { ActionState } from "@/lib/types/actionState";
import serverAction from "./serverAction";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { userInfo, enter } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<UserSessionInfo["email"]>(
    userInfo?.email ?? ""
  );
  const [avatar, setAvatar] = useState<UserSessionInfo["avatarUrl"]>(
    userInfo?.avatarUrl ?? ""
  );

  const action = useCallback(
    async (state: ActionState, formData: FormData): Promise<ActionState> => {
      if (!userInfo) {
        return {
          error: true,
          message: "用户信息不存在",
        };
      }
      formData.append("token", userInfo.token);
      const res = await serverAction(formData);

      if (res?.code !== 200) {
        return {
          error: true,
          message: res?.message ?? "修改失败",
        };
      }

      enter(res.data);

      setTimeout(() => {
        router.push("/");
      }, 500);

      return {
        error: false,
        message: "修改成功",
      };
    },
    [userInfo, enter, router]
  );

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    null,
    "/signIn"
  );

  return (
    <main className="min-h-screen flex items-center">
      <UserInfoFormTemplate
        title="编辑资料"
        formAction={formAction}
        initialValues={{ name: userInfo?.name || "" }}
        isPending={isPending}
      >
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder="输入您的邮箱"
          />
        </InputGroup>

        <div className="flex items-center gap-4">
          <InputGroup>
            <InputGroupAddon>
              <AvatarSvg size={18} />
            </InputGroupAddon>
            <InputGroupInput
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              name="avatar"
              type="text"
              placeholder="输入您的头像链接"
            />
          </InputGroup>
          <Avatar>
            <AvatarImage src={avatar} alt={"@" + userInfo?.name} />
            <AvatarFallback className="select-none">
              {userInfo?.name.toString().slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <section>
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

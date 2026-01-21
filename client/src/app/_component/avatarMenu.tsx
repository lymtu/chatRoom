"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/context/auth";
import { MyLink } from "@/components/global/myLink";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AvatarMenu() {
  const { userInfo, exit } = useAuth();
  const router = useRouter();
  return (
    <>
      {userInfo ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={userInfo.avatarUrl}
                  alt={"@" + userInfo.name}
                />
                <AvatarFallback className="select-none cursor-pointer">
                  {userInfo?.name?.slice(0, 2)?.toUpperCase() ?? "UN"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                {userInfo?.name ?? "未登录"}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  编辑资料
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  exit();
                }}
              >
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {userInfo.role === "admin" && (
            <Button variant="outline" onClick={() => router.push("/admin")}>
              管理空间
            </Button>
          )}
        </>
      ) : (
        <>
          <MyLink href="/signIn">登录</MyLink>
          <Button variant="outline" onClick={() => router.push("/signUp")}>
            注册
          </Button>
        </>
      )}
    </>
  );
}

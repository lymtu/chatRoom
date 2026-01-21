"use client";

import Form from "next/form";
import EditNameSvg from "@/components/svg/editName";
import { MyLink } from "@/components/global/myLink";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

import { useState } from "react";

export function UserInfoFormTemplate({
  formAction,
  isPending,
  title,
    children,
    initialValues
}: {
  formAction: (formData: FormData) => void | Promise<void>;
  isPending?: boolean;
  title: string;
  children?: React.ReactNode;
  initialValues?: {
    name: string;
  }
}) {
    const [name, setName] = useState<string>(initialValues?.name ?? '');

  return (
    <div className="w-full max-w-sm mx-auto">
      <div>
        <MyLink href="/">返回主页</MyLink>
      </div>
      <h3 className="text-xl font-bold text-center mt-4">{title}</h3>
      <Form action={formAction} className="flex flex-col gap-6 mt-6">
        <InputGroup>
          <InputGroupAddon>
            <EditNameSvg size={18} />
          </InputGroupAddon>
          <InputGroupInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="username"
            minLength={2}
            required
            type="text"
            placeholder="输入您的名字"
          />
        </InputGroup>
        {children}

        <div className="w-3/4 mx-auto">
          <Button
            disabled={isPending}
            variant="outline"
            className="text-white! w-full bg-blue-500! hover:bg-blue-600!"
            aria-label="Submit"
            type="submit"
          >
            {isPending && <Spinner />}提交
          </Button>
        </div>
      </Form>
    </div>
  );
}

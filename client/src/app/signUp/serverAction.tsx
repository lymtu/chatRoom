"use server";

import { AuthContextUserInfo } from "@/lib/context/auth";
import { commitUserSession } from "@/lib/session/userSession";
import type { Response } from "@/lib/types/response";
import { UserSessionInfo } from "@/lib/types/user";
import dbCollectionName from "@/lib/utils/dbCollectionName";
import { findOne, getCount, insert } from "@/lib/utils/mongodb";
import responseStore from "@/lib/utils/responseStore";
import bcrypt from "bcryptjs";

const serverAction = async (
  formData: FormData
): Promise<Response<AuthContextUserInfo>> => {
  const name = String(formData.get("username"));
  const password = String(formData.get("password"));
  const email = String(formData.get("email"));

  if (!name || !password) {
    return responseStore[400]("缺少参数");
  }

  try {
    const result_find_user = await findOne(dbCollectionName.USERS, {
      name,
    });

    if (result_find_user) {
      return responseStore[409]("用户名已存在");
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const id = (await getCount(dbCollectionName.USERS))
      .toString(36)
      .padStart(6, "0");

    const insertDocumnet: Record<string, string | number> = {
      id,
      name,
      password: hashedPassword,
      salt,
      role: "user",
      status: 1,
    };

    if (email) {
      insertDocumnet["email"] = email;
    }

    const result_insert = await insert(dbCollectionName.USERS, insertDocumnet);

    if (!result_insert) {
      throw new Error("insert error");
    }

    const resData: UserSessionInfo = {
      name,
      id,
      email,
      role: "user",
      avatarUrl: "",
    };

    return {
      code: 200,
      data: {
        ...resData,
        token: await commitUserSession(resData),
      },
    };
  } catch (error) {
    console.log(error);

    return responseStore[500]();
  }
};

export default serverAction;

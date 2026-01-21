"use server";

import { AuthContextUserInfo } from "@/lib/context/auth";
import { commitUserSession } from "@/lib/session/userSession";
import { Response } from "@/lib/types/response";
import { UserSessionInfo } from "@/lib/types/user";
import dbCollectionName from "@/lib/utils/dbCollectionName";
import { findOne } from "@/lib/utils/mongodb";
import responseStore from "@/lib/utils/responseStore";
import bcrypt from "bcryptjs";

const serverAction = async (
  formData: FormData
): Promise<Response<AuthContextUserInfo> | null> => {
  const name = String(formData.get("username"));
  const password = String(formData.get("password"));

  if (!name || !password) {
    return responseStore[400]("缺少参数");
  }

  try {
    const result_find_user = await findOne(dbCollectionName.USERS, {
      name,
    });

    if (!result_find_user) {
      return responseStore[400]("用户不存在");
    }

    const hash = bcrypt.hashSync(password, result_find_user.salt);

    if (hash !== result_find_user.password) {
      return responseStore[400]("密码错误");
    }

    if (result_find_user.status === 0) {
      return responseStore[400]("用户已被禁用");
    }

    const resData: UserSessionInfo = {
      id: result_find_user.id,
      name: result_find_user.name,
      email: result_find_user?.email ?? "",
      role: result_find_user.role,
      avatarUrl: result_find_user?.avatarUrl ?? "",
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

"use server";

import { AuthContextUserInfo } from "@/lib/context/auth";
import { getUserSession, updateUserSession } from "@/lib/session/userSession";
import { Response } from "@/lib/types/response";
import { UserSessionInfo } from "@/lib/types/user";
import dbCollectionName from "@/lib/utils/dbCollectionName";
import { findOne, updateOne } from "@/lib/utils/mongodb";
import responseStore from "@/lib/utils/responseStore";

const serverAction = async (
  formData: FormData
): Promise<Response<AuthContextUserInfo> | null> => {
  const name = String(formData.get("username"));
  const email = String(formData.get("email"));
  const avatarUrl = String(formData.get("avatar"));
  const token = String(formData.get("token"));

  if (!token) {
    return responseStore[401]("缺少token");
  }
  const result_find_session = await getUserSession(token);

  if (!result_find_session) {
    return responseStore[401]("token无效");
  }

  if (!name) {
    return responseStore[400]("缺少名称");
  }

  const id = result_find_session.id;

  try {
    const result_find_user = await findOne(dbCollectionName.USERS, {
      id,
    });

    if (!result_find_user) {
      return responseStore[404]("用户不存在");
    }

    const result_update_user = await updateOne(
      dbCollectionName.USERS,
      {
        id,
      },
      {
        $set: {
          name,
          email,
          avatarUrl,
        },
      }
    );

    if (!result_update_user) {
      return responseStore[500]();
    }

    const sessionInfo: UserSessionInfo = {
      id,
      name,
      email,
      avatarUrl,
      role: result_find_user.role,
      };
      
    const result_update_session = await updateUserSession(token, sessionInfo);

    if (!result_update_session) {
      return responseStore[500]();
    }

    return {
      code: 200,
      data: {
        ...sessionInfo,
        token,
      },
    };
  } catch (error) {
    console.log(error);
    return responseStore[500]();
  }
};

export default serverAction;

import "server-only";
import type { UserSessionInfo } from "../types/user";
import createToken from "../utils/createToken";
import redisClient from "../utils/redis";

export const getUserSession = async (
  token: string
): Promise<UserSessionInfo | null> => {
  const result = (await redisClient.json.get(
    "token:" + token
  )) as UserSessionInfo;
  if (!result) return null;
  return result;
};

export const commitUserSession = async (info: UserSessionInfo) => {
  const token = createToken();
  const [resule_set, resultExpire] = await Promise.all([
    redisClient.json.set("token:" + token, "$", info, {
      NX: true,
    }),
    redisClient.expire("token:" + token, 60 * 60 * 24), // 1 day
  ]);

  if (!resule_set || resultExpire === 0) return null;

  return token;
};

export const updateUserSession = async (
  token: string,
  info: UserSessionInfo
) => {
  const [resule_set, resultExpire] = await Promise.all([
    redisClient.json.set("token:" + token, "$", info, {
      XX: true,
    }),
    redisClient.expire("token:" + token, 60 * 60 * 24), // 1 day
  ]);

  if (!resule_set || resultExpire === 0) return null;
  return "OK";
};

export const removeUserSession = async (token: string) => {
  return await redisClient.del("token:" + token);
};

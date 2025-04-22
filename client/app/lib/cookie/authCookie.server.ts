import { createCookie } from "react-router";

const authCookie = createCookie("auth", {
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  //   secure: true,
  secrets: ["n3wsecr3t"],
});

export default authCookie;

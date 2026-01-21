import { randomBytes } from "crypto";

export default function createToken() {
  return randomBytes(32).toString("hex");
}

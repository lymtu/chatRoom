"use client";

const digestPwd = async (password: string) => {
  const msgUint8 = new TextEncoder().encode(
    password + process.env.NEXT_PUBLIC_SALT!
  );

  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

export default digestPwd;

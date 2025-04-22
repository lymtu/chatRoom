import type { Route } from "./+types/home";
import LogoLight from "/logo-light.svg";
import LogoDark from "/logo-dark.svg";

import { ThemeContext } from "~/lib/context/themeContext";
import { useContext } from "react";
import LinkBtn from "~/components/linkBtn";

import ThemeSwitchButton from "~/components/themeSwitchButton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex h-screen">
      <div className="m-auto flex flex-col items-center gap-2">
        <img
          src={theme === "dark" ? LogoDark : LogoLight}
          className="w-64 select-none user-drag-none"
          alt=""
        />
        <h1 className="text-2xl font-bold mt-6">Chat Room</h1>
        <ThemeSwitchButton />
        <LinkBtn className="mt-6 text-xl" to="/select">
          Get Started
        </LinkBtn>
      </div>
    </div>
  );
}

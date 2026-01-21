"use client";
import { useTheme } from "@/lib/context/theme";

import { Button } from "@/components/ui/button";
import SunSvg from "@/components/svg/sun";
import MoonSvg from "@/components/svg/moon";

export function ThemeToggleBtn() {
  const { isDarkTheme, toggleTheme } = useTheme();
  return (
    <div>
      <Button variant="outline" onClick={toggleTheme}>
        <span>切换主题</span>
        {isDarkTheme ? <MoonSvg /> : <SunSvg />}
      </Button>
    </div>
  );
}

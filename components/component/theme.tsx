"use client";

import * as React from "react";
import { Moon, Sun, LeafyGreen ,SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const getThemeIcon = (theme: string | undefined) => {
    if (theme === undefined) return <></>;
    switch (theme) {
      case "light":
        return <Sun />;
      case "dark":
        return (
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        );
      case "customgreen":
        return <LeafyGreen />;
      case "system":
        return < SunMoon></SunMoon>
      default:
        return <></>;
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  size="icon" className="bg-primary">
          {getThemeIcon(theme)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("customgreen")}
        >
          Green
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

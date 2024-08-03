"use client";
import * as React from "react";
import { Moon, Sun, LeafyGreen, SunMoon } from "lucide-react";
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
  // const getThemeIcon = (theme: string | undefined) => {
  //   if (theme === undefined) return <Sun />;
  //   switch (theme) {
  //     case "light":
  //       return <Sun  />;
  //     case "dark":
  //       return <SunMoon />;
  //     case "customgreen":
  //       return <LeafyGreen />;
  //     case "system":
  //       return <SunMoon />;
  //     default:
  //       return <Sun />;
  //   }
  // };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="bg-primary rounded-full">
          {/* {getThemeIcon(theme)}
           */}
          <Sun />
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
          Purple
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

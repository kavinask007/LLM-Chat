"use client";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SHEET_SIDE = "left";

export function SheetSide() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const handleProviderChange = (value: SetStateAction<string>) => {
    console.log(value);
    setSelectedProvider(value);
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet key={SHEET_SIDE}>
        <SheetTrigger asChild>
          <Button variant="outline">{SHEET_SIDE}</Button>
        </SheetTrigger>
        <SheetContent side={SHEET_SIDE}>
          <SheetHeader>
            <SheetTitle>Model Settings</SheetTitle>
            <SheetDescription>
              Customize the model and it's input settings
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="">Provider : </Label>
              <Select onValueChange={handleProviderChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Model Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="bedrock">Bedrock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedProvider === "groq" && (
              <>
                <Label className="py-4">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="sk-xxxxxxxxxxxxxxxxxx"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                 <Button disabled={accessToken==""}>
                  Fetch Models
                </Button>
              </>
             
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" disabled={true}>
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

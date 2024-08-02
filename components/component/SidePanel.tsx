"use client";
import { SetStateAction, useState, useContext } from "react";
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
import { Menu } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  MyContext,
  MyContextData,
} from "@/components/component/ContextProvider";
const SHEET_SIDE = "left";
interface MyComponentProps {
  model_id: string;
  Temperature: number;
  repeat_penalty: number;
  seed: number;
  top_p: number;
  max_seq_len: number;
}
export const SheetSide = () => {
  // export function SheetSide() {
  const { data, setData } = useContext(MyContext) as MyContextData;
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet key={SHEET_SIDE}>
        <SheetTrigger asChild>
          <Menu className="primary cursor-pointer" strokeWidth={1.25} />
        </SheetTrigger>
        <SheetContent side={SHEET_SIDE}>
          <SheetHeader>
            <SheetTitle>Choose Model</SheetTitle>
            <SheetDescription>
              Choose the phi model that&aposll be downloaded for the first time
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 ">
            <Label className="">Model Provider : </Label>
            <Select
              value={data.model_provider}
              onValueChange={(value) =>
                setData((previous: any) => ({
                  ...previous,
                  model_provider: value,
                }))
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Model Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="groq">groq</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {data.model_provider == "local" && (
            <div className="grid gap-4 py-4">
              <LocalModelSettings />
            </div>
          )}
          {data.model_provider == "groq" && <GroqSettings />}
          <SheetFooter>
            <SheetClose asChild>
              {/* <Button type="submit" disabled={true}>
                Save changes
              </Button> */}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const GroqSettings = () => {
  const { data, setData } = useContext(MyContext) as MyContextData;
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="accessToken">Access Token</Label>
        <Input
          className="w-[150px]"
          id="accessToken"
          type="password"
          placeholder="sk-xxxxxxxxxxxxxxxxxx"
          value={data.groq_access_token}
          onChange={(e) =>
            setData((previous: any) => ({
              ...previous,
              groq_access_token: e.target.value,
            }))
          }
        />
      </div>
      <div>
        <Label className="">Model : </Label>
        <Select
          value={data.groq_model}
          onValueChange={(value) =>
            setData((previous: any) => ({ ...previous, groq_model: value }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemma2-9b-it">gemma2-9b-it</SelectItem>
            <SelectItem value="mixtral-8x7b-32768">
              mixtral-8x7b-32768
            </SelectItem>
            <SelectItem value="llama3-70b-8192">llama3-70b-8192</SelectItem>
            <SelectItem value="llama-3.1-8b-instant">
              llama-3.1-8b-instant
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const LocalModelSettings = () => {
  const { data, setData } = useContext(MyContext) as MyContextData;
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="">Model : </Label>
        <Select
          value={data.model_id}
          onValueChange={(value) =>
            setData((previous: any) => ({ ...previous, model_id: value }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phi_1_5_q4k">
              Phi-1.5-4bit-qunatized (800 MB)
            </SelectItem>
            <SelectItem value="phi_1_5_q80">
              Phi-1.5-8bit-quantized (1.51 GB)
            </SelectItem>
            <SelectItem value="puffin_phi_v2_q4k">
              Puffin-Phi-V2-4bit-quanitized (798 MB)
            </SelectItem>
            <SelectItem value="puffin_phi_v2_q80">
              Puffin-Phi-V2-8bit-quanitized (1.50 GB)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Label className="">Temperature : {data.Temperature}</Label>
      <Slider
        defaultValue={[data.Temperature]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={(value) =>
          setData((previous: any) => ({
            ...previous,
            Temperature: value[0],
          }))
        }
      />
      <Label className="">top_p : {data.top_p}</Label>
      <Slider
        defaultValue={[data.top_p]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={(value) =>
          setData((previous: any) => ({ ...previous, top_p: value[0] }))
        }
      />
      <Label className="">Repeat Penalty : {data.repeat_penalty}</Label>
      <Slider
        defaultValue={[data.repeat_penalty]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={(value) =>
          setData((previous: any) => ({
            ...previous,
            repeat_penalty: value[0],
          }))
        }
      />
      <Label className="">Max Sequence Length : {data.max_seq_len}</Label>
      <Slider
        defaultValue={[data.max_seq_len]}
        max={2048}
        min={1}
        step={1}
        onValueChange={(value) =>
          setData((previous: any) => ({
            ...previous,
            max_seq_len: value[0],
          }))
        }
      />
      <Label className="">Seed : {data.seed}</Label>
      <Slider
        defaultValue={[data.seed]}
        max={4000000000}
        min={1}
        step={100}
        onValueChange={(value) =>
          setData((previous: any) => ({ ...previous, seed: value[0] }))
        }
      />
    </>
  );
};

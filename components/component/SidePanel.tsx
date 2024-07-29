"use client";
import { SetStateAction, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from 'lucide-react';
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
              Choose the phi model that'll be downloaded for the first time
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="">Model : </Label>
              <Select
                value={data.model_id}
                onValueChange={(value) =>
                  setData((previous: any) => ({ ...previous, model_id: value }))
                }
              >
                <SelectTrigger className="w-[250px]">
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
          </div>
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

"use client";
import { Chat2 } from "@/components/component/chat2";
import { Test } from "@/components/component/test";
import { MyContextProvider } from "@/components/component/ContextProvider";
import { AudioRecorder ,} from "@/components/component/AudioComponent";
export default function Home() {
  return (
    <MyContextProvider>
      <Chat2 />
      {/* <AudioRecorder/> */}
    </MyContextProvider>
  );
}

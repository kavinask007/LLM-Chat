"use client";
import {
  useState,
  useEffect,
  SetStateAction,
  JSX,
  SVGProps,
  useContext,
  useRef,
} from "react";
import * as marked from "marked";
import { Progress } from "@/components/ui/progress";
import { useRecordVoice } from "@/components/component/attempt";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
// import { getChatStream } from "@/components/Services/Groq";
import { ModeToggle } from "@/components/component/theme";
import { SheetSide } from "@/components/component/SidePanel";
import { getChatStream } from "@/components/Services/Groq";
import {
  MyContext,
  MyContextData,
} from "@/components/component/ContextProvider";
import { CircleStop, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const model: any = {
  phi_1_5_q4k: {
    base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-q4k.gguf",
    tokenizer: "tokenizer.json",
    config: "phi-1_5.json",
    quantized: true,
    seq_len: 2048,
    size: "800 MB",
  },
  phi_1_5_q80: {
    base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-q80.gguf",
    tokenizer: "tokenizer.json",
    config: "phi-1_5.json",
    quantized: true,
    seq_len: 2048,
    size: "1.51 GB",
  },
  phi_2_0_q4k: {
    base_url: "https://huggingface.co/radames/phi-2-quantized/resolve/main/",
    model: [
      "model-v2-q4k.gguf_aa.part",
      "model-v2-q4k.gguf_ab.part",
      "model-v2-q4k.gguf_ac.part",
    ],
    tokenizer: "tokenizer.json",
    config: "config.json",
    quantized: true,
    seq_len: 2048,
    size: "1.57GB",
  },
  puffin_phi_v2_q4k: {
    base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-puffin-phi-v2-q4k.gguf",
    tokenizer: "tokenizer-puffin-phi-v2.json",
    config: "puffin-phi-v2.json",
    quantized: true,
    seq_len: 2048,
    size: "798 MB",
  },
  puffin_phi_v2_q80: {
    base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-puffin-phi-v2-q80.gguf",
    tokenizer: "tokenizer-puffin-phi-v2.json",
    config: "puffin-phi-v2.json",
    quantized: true,
    seq_len: 2048,
    size: "1.50 GB",
  },
};

interface Message {
  id: number;
  sender: string;
  text: string;
  isTyping: boolean;
}

export function Chat2() {
  // const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const { data, setData } = useContext(MyContext) as MyContextData;
  const [url, setUrl] = useState(null);
  const { recording, startRecording, stopRecording } = useRecordVoice(setUrl);
  const [isAudioProcessing, setIsAudioprocessing] = useState(false);

  // const { toast } = useToast();

  const workerRef = useRef<Worker>();
  const WhisperWorkerRef = useRef<Worker>();
  useEffect(() => {
    workerRef.current = new Worker("./phiWorker.js", {
      type: "module",
    });
    WhisperWorkerRef.current = new Worker("./whisperWorker.js", {
      type: "module",
    });
    WhisperWorkerRef.current.onmessage = (event: { data: any }) => {
      // toast({
      //   title: "Whisper-Model",
      //   description: event.data.message,
      //   action: <></>,
      // });
      console.log(event);
      toast(`Whisper`, {
        description: event.data.message,
      });

      if (event.data.message == "complete") {
        let fullText = "";

        event.data.output?.forEach((segment: { dr: { text: string } }) => {
          if (segment.dr && segment.dr.text) {
            let cleanedText = segment.dr.text.replace(/<\|.*?\|>/g, "").trim();
            fullText += cleanedText + " ";
          }
        });
        setInputValue(fullText);
        setIsAudioprocessing(false);
      }
    };
    workerRef.current.onmessage = (event: { data: any }) => {
      console.log;
      if (event.data.message == "complete") {
        setIsInputDisabled(false);
      }
      if (event.data.message == "Generating token") {
        let msg = event.data.sentence;
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            text: msg,
            isTyping: false,
          };
          return [...prevMessages.slice(0, -1), updatedMessage];
        });
      } else {
        // toast({
        //   title: `Model - ${data.model_id}`,
        //   description: event.data.message,
        //   action: <></>,
        // });
        toast(`Model - ${data.model_id}`, {
          description: event.data.message,
          // action: {
          //   label: "Undo",
          //   onClick: () => console.log("Undo"),
          // },
        });
      }
    };
    workerRef.current.onerror = (error: any) => {
      console.error("Worker error:", error);
    };
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleAbort = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "abort" });
      setIsInputDisabled(false);
    }
  };
  const startWorker = (prompt: string) => {
    prompt =
      " You're a Helfull AI assistant.\n USER: " + prompt + "\n Assistant:";
    if (workerRef.current) {
      const model_data = model[data.model_id];
      const weightsURL = model_data.base_url + model_data.model;
      const tokenizerURL = model_data.base_url + model_data.tokenizer;
      const configURL = model_data.base_url + model_data.config;
      const model_id = data.model_id;
      const repeat_penalty = data.repeat_penalty;
      const max_seq_length = data.max_seq_len;
      const top_p = data.top_p;
      workerRef.current.postMessage({
        weightsURL,
        modelID: model_id,
        tokenizerURL,
        configURL,
        quantized: model_data.quantized,
        prompt,
        temp: data.Temperature,
        top_p: top_p,
        repeatPenalty: repeat_penalty,
        seed: data.seed,
        maxSeqLen: max_seq_length,
        command: "start",
      });
    }
  };
  useEffect(() => {
    console.log(url);
    if (url != null) {
      addAudioElement(url);
    }
  }, [url]);
  const handleMicClick = () => {
    if (recording) {
      stopRecording();
      setIsAudioprocessing(true);
    } else {
      startRecording();
    }
    // setIsRecording(!isRecording);
    setIsInputDisabled(!recording);
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  const addAudioElement = (url: string) => {
    var obj = {
      weightsURL:
        "https://huggingface.co/openai/whisper-tiny.en/resolve/main/model.safetensors",
      modelID: "tiny_en",
      tokenizerURL:
        "https://huggingface.co/openai/whisper-tiny.en/resolve/main/tokenizer.json",
      configURL:
        "https://huggingface.co/openai/whisper-tiny.en/resolve/main/config.json",
      mel_filtersURL: "mel_filters.safetensors",
      audioURL: url,
    };
    if (WhisperWorkerRef.current) {
      WhisperWorkerRef.current.postMessage(obj);
    }
  };
  const handleAudioProcessingCancel = () => {
    setIsAudioprocessing(false); //IsAudioprocessing(false); //IsAudioprocessing(false);
  };

  const handleSendMessage = async () => {
    try {
      if (inputValue.trim() !== "") {
        const newMessage: Message = {
          id: messages.length + 1,
          sender: "user",
          text: inputValue,
          isTyping: false,
        };
        const responseMessage = {
          id: messages.length + 2,
          sender: "ai",
          text: "",
          isTyping: true,
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
          responseMessage,
        ]);
        setInputValue("");
        setIsInputDisabled(true);
        if (data.model_provider == "groq") {
          const stream = await getChatStream(
            inputValue,
            data.groq_access_token,
            data.groq_model
          );
          for await (const chunk of stream) {
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              const updatedMessage = {
                ...lastMessage,
                text: chunk || "",
                isTyping: false,
              };
              return [...prevMessages.slice(0, -1), updatedMessage];
            });
            setIsInputDisabled(false);
          }
        } else {
          startWorker(inputValue);
        }
      }
    } catch (e) {
      if (e) {
        toast(`LLM Call`, {
          description:
            "Error : Make sure a Model is selected with all parameters" +
            e.toString(),
        });
      }
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        const updatedMessage = {
          ...lastMessage,
          text: "OOPS",
          isTyping: false,
        };
        return [...prevMessages.slice(0, -1), updatedMessage];
      });
      setIsInputDisabled(false);
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <header className="text-muted-foreground p-4 ">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <Avatar className="w-8 h-8 rounded-full hidden lg:flex">
              <SheetSide />
            </Avatar>
            <h1 className="text-lg px-4 font-semibold text-primary">
              Local Chat
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
            >
              <SheetSide />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent ">
        <div className="container mx-auto max-w-2xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 max-w-300 whitespace-normal break-words ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "user" ? (
                <User className={`primary order-2`} />
              ) : (
                <Avatar>
                  {" "}
                  <AvatarImage src="/placeholder-user.jpg" />
                </Avatar>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[70%] overflow-x ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground "
                    : "bg-card "
                }`}
              >
                {message.text}
                {/* {isInputDisabled ? (
                  <>{message.text} </>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.text),
                    }}
                  />
                )} */}
                {message.isTyping && (
                  <div className="flex-col items-center justify-center text-primary-foreground ">
                    <Skeleton className="h-4 w-[30vw]" />
                    <Skeleton className="h-4 w-[25vw] mt-1" />
                    <Skeleton className="h-4 w-[15vw] mt-1" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-background p-4 shadow-md ">
        <div className="container mx-auto flex items-center gap-2">
          {isAudioProcessing ? (
            <Button
              className="animate-pulse bg-destructive rounded-full"
              onClick={handleAudioProcessingCancel}
            >
              <CrossIcon />
            </Button>
          ) : (
            <Button
              variant={recording ? "default" : "ghost"}
              size="icon"
              className={`rounded-full ${
                recording
                  ? "animate-pulse bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={handleMicClick}
            >
              <MicIcon
                className={`w-5 h-5 ${
                  recording
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          )}
          <Textarea
            placeholder="Type your message..."
            className="flex-1 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none border-none"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSendMessage();
              }
            }}
            disabled={isInputDisabled}
          />
          {!isAudioProcessing && (
            <>
              {!isInputDisabled ? (
                <Button
                  className="rounded-full bg-primary text-primary-foreground "
                  onClick={handleSendMessage}
                  disabled={isInputDisabled}
                >
                  <SendIcon className="w-5 h-5  text-primary-foreground" />
                  <span className="sr-only">Send</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="rounded-full animate-pulse bg-primary text-primary-foreground"
                  onClick={handleAbort}
                >
                  <CircleStop className="primary" />
                </Button>
              )}
            </>
          )}
        </div>
      </footer>
    </div>
  );
}

function MicIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function SendIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
function CrossIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-circle-x"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useContext } from "react";
import {
  MyContext,
  MyContextData,
} from "@/components/component/ContextProvider";
import { SheetSide } from "@/components/component/SidePanel";
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
// const repeatPenalty = 1;
// const weightsURL =
//   model.model instanceof Array
//     ? model.model.map((m: any) => model.base_url + m)
//     : model.base_url + model.model;
// const tokenizerURL = model.base_url + model.tokenizer;
// const configURL = model.base_url + model.config;
// const model_id = model.model_id;
// const seq_length = model.seq_length;
const prompt = "who is kavinraj?";

export const Test = () => {
  const { data, setData } = useContext(MyContext) as MyContextData;

  const [msg, setmsg] = useState("");
  const [tokens, settokens] = useState("");
  const workerRef = useRef<Worker>();
  useEffect(() => {
    workerRef.current = new Worker("./phiWorker.js", {
      type: "module",
    });
    workerRef.current.onmessage = (event) => {
      console.log(event);
      setmsg(event.data.message);
      if (event.data.message == "Generating token") {
        settokens(event.data.sentence);
      }
    };
    workerRef.current.onerror = (error) => {
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
    }
  };
  const startWorker = () => {
    if (workerRef.current) {
      const model_data = model[data.model_id];
      const weightsURL = model_data.base_url + model_data.model;
      const tokenizerURL = model_data.base_url + model_data.tokenizer;
      const configURL = model_data.base_url + model_data.config;
      const model_id = data.model_id;
      const repeat_penalty = data.repeat_penalty;
      const max_seq_length = data.max_seq_len;
      const top_p = data.top_p;
      console.log({
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

  return (
    <>
      <SheetSide />
      <h1>Hola</h1>
      <Button onClick={startWorker}>start</Button>
      <Button onClick={handleAbort}>stop</Button>
      <h1>{msg}</h1>
      <br></br>
      <h1> {tokens}</h1>
    </>
  );
};

"use client";
import { createContext, useState, useEffect } from "react";

export interface MyContextData {
  data: { [key: string]: any };
  setData: (data: { [key: string]: any }) => void;
}

const MyContext = createContext<MyContextData | null>(null);

const MyContextProvider = ({ children }: { children: React.ReactNode }) => {
  var storedData: string | null = "{}";
  if (typeof window !== "undefined") {
    storedData = localStorage.getItem("myContextData");
  }

  const initialState = storedData
    ? JSON.parse(storedData)
    : {
        model_provider: "local",
        model_id: "phi_1_5_q4k",
        Temperature: 0,
        top_p: 1,
        repeat_penalty: 1,
        max_seq_len: 2048,
        seed: 69420,
      };
  const [data, setData] = useState(initialState);
  // useEffect(() => {
  //   localStorage.setItem("myContextData", JSON.stringify(data));
  // }, [data]);
  useEffect(() => {
    localStorage.setItem(
      "myContextData",
      JSON.stringify(data, (key, value) => {
        if (typeof value === "function") {
          return undefined;
        }
        return value;
      })
    );
  }, [data]);
  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };

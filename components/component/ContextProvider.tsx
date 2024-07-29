"use client";
import { createContext, useState, useEffect } from "react";

export interface MyContextData {
  data: { [key: string]: any };
  setData: (data: { [key: string]: any }) => void;
}

const MyContext = createContext<MyContextData | null>(null);

const MyContextProvider = ({ children }: { children: React.ReactNode }) => {
  var storedData: string| null = '{}';
  if (typeof window !== "undefined") {
    storedData = localStorage.getItem("myContextData");
  }

  const initialState = storedData ? JSON.parse(storedData) : {};
  const [data, setData] = useState(initialState);
  // useEffect(() => {
  //   localStorage.setItem("myContextData", JSON.stringify(data));
  // }, [data]);
  useEffect(() => {
    localStorage.setItem("myContextData", JSON.stringify(data, (key, value) => {
      if (typeof value === 'function') {
        return undefined;
      }
      return value;
    }));
  }, [data]);
  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };

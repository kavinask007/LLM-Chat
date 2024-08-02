// "use client";
// import { useState, useEffect, SetStateAction, JSX, SVGProps } from "react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Textarea } from "@/components/ui/textarea";
// import { DrawerDemo } from "@/components/component/drawer";
// import { getChatStream } from "@/components/Services/Groq";
// import { ModeToggle } from "@/components/component/theme";
// interface Message {
//   id: number;
//   sender: string;
//   text: string;
//   isTyping: boolean;
// }

// export function Chat2() {
//   const [isRecording, setIsRecording] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isInputDisabled, setIsInputDisabled] = useState(false);

//   const handleMicClick = () => {
//     setIsRecording(!isRecording);
//     setIsInputDisabled(!isRecording);
//   };

//   const handleInputChange = (e: {
//     target: { value: SetStateAction<string> };
//   }) => {
//     setInputValue(e.target.value);
//   };

//   const handleSendMessage = async () => {
//     if (inputValue.trim() !== "") {
//       const newMessage: Message = {
//         id: messages.length + 1,
//         sender: "user",
//         text: inputValue,
//         isTyping: false,
//       };
//       const responseMessage = {
//         id: messages.length + 2,
//         sender: "ai",
//         text: "",
//         isTyping: true,
//       };
//       setMessages((prevMessages) => [...prevMessages, newMessage,responseMessage]);
//       setInputValue("");
//       setIsInputDisabled(true);
//       const stream = await getChatStream(inputValue);
//       for await (const chunk of stream) {
//         setMessages((prevMessages) => {
//           const lastMessage = prevMessages[prevMessages.length - 1];
//             const updatedMessage = {
//               ...lastMessage,
//               text: chunk || "",
//               isTyping: false,
//             };
//             return [...prevMessages.slice(0, -1), updatedMessage];
   
//         })

//       }
//       setIsInputDisabled(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen light:bg-muted">
//       <header className="text-muted-foreground p-4 shadow-md light:bg-muted-foreground light:text-muted">
//         <div className="container mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full lg:hidden"
//             >
//               <BeefIcon className="w-5 h-5" />
//               <span >Toggle menu</span>
//             </Button>
//             <Avatar className="w-8 h-8 rounded-full hidden lg:flex">
//               <AvatarImage src="/placeholder-user.jpg" />
//               <AvatarFallback>AI</AvatarFallback>
//             </Avatar>
//             <h1 className="text-lg font-semibold">AI Chat</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full lg:hidden"
//             >
//               <MenuIcon className="w-5 h-5" />
//               <span className="sr-only">Toggle menu</span>
//             </Button>
//             <ModeToggle />
//           </div>
//         </div>
//       </header>
//       <main className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent light:scrollbar-thumb-muted-foreground">
//         <div className="container mx-auto max-w-2xl space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex items-start gap-4 ${
//                 message.sender === "user" ? "justify-end" : ""
//               }`}
//             >
//               <Avatar
//                 className={`w-8 h-8 rounded-full ${
//                   message.sender === "user" ? "order-2" : ""
//                 }`}
//               >
//                 <AvatarImage src="/placeholder-user.jpg" />
//                 <AvatarFallback>
//                   {message.sender.charAt(0).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               <div
//                 className={`p-3 rounded-2xl max-w-[70%] ${
//                   message.sender === "user"
//                     ? "bg-primary text-primary-foreground light:bg-primary light:text-primary-foreground"
//                     : "bg-card light:bg-muted-foreground light:text-muted"
//                 }`}
//               >
//                 {message.text}
//                 {message.isTyping && (
//                   <div className="flex items-center gap-1 mt-2 text-primary-foreground">
//                     <div className="w-2 h-2 rounded-full bg-current animate-pulse-dots" />
//                     <div className="w-2 h-2 rounded-full bg-current animate-pulse-dots delay-100" />
//                     <div className="w-2 h-2 rounded-full bg-current animate-pulse-dots delay-200" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//       <footer className="bg-background p-4 shadow-md light:bg-muted-foreground light:text-muted">
//         <div className="container mx-auto flex items-center gap-2">
//           <Button
//             variant={isRecording ? "default" : "ghost"}
//             size="icon"
//             className={`rounded-full ${
//               isRecording
//                 ? "animate-pulse bg-primary text-primary-foreground"
//                 : ""
//             }`}
//             onClick={handleMicClick}
//           >
//             <MicIcon
//               className={`w-5 h-5 ${
//                 isRecording
//                   ? "text-primary-foreground"
//                   : "text-muted-foreground"
//               }`}
//             />
//             <div
//               className={`flex items-center gap-1 text-primary-foreground absolute bottom-0 -translate-y-full ${
//                 isRecording ? "flex" : "hidden"
//               }`}
//             >
//               <div className="w-2 h-2 rounded-full bg-current animate-pulse-dots" />
//               <div className="w-2 h-2 rounded-full bg-current animate-pulse-dots delay-100" />
//               <div className="w-2 h-2 rounded-full bg-current animate-pulse-dots delay-200" />
//             </div>
//             <span className="sr-only">Record</span>
//           </Button>
//           <Textarea
//             placeholder="Type your message..."
//             className="flex-1 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary light:bg-muted light:text-muted-foreground resize-none border-none"
//             value={inputValue}
//             onChange={handleInputChange}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSendMessage();
//               }
//             }}
//             disabled={isInputDisabled}
//           />
//           <Button
//             className="rounded-full bg-primary text-primary-foreground"
//             onClick={handleSendMessage}
//             disabled={isInputDisabled}
//           >
//             <SendIcon className="w-5 h-5 bg-primary text-primary-foreground" />
//             <span className="sr-only">Send</span>
  
//           </Button>
//           <DrawerDemo/>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function BeefIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="12.5" cy="8.5" r="2.5" />
//       <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z" />
//       <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5" />
//     </svg>
//   );
// }

// function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <line x1="4" x2="20" y1="12" y2="12" />
//       <line x1="4" x2="20" y1="6" y2="6" />
//       <line x1="4" x2="20" y1="18" y2="18" />
//     </svg>
//   );
// }

// function MicIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
//       <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
//       <line x1="12" x2="12" y1="19" y2="22" />
//     </svg>
//   );
// }

// function SendIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m22 2-7 20-4-9-9-4Z" />
//       <path d="M22 2 11 13" />
//     </svg>
//   );
// }

// function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   );
// }

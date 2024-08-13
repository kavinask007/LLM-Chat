import { ChatGroq } from "@langchain/groq";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export async function getChatStream(
  input: any,
  messages: any,
  api_key: string,
  modelname: string
): Promise<AsyncGenerator<string>> {
  const model = new ChatGroq({
    apiKey: api_key,
    model: modelname,
  });
  var messages_formated = messages.map((message: any) => {
    console.log(message);
    if (message.sender === "user") {
      return new HumanMessage(message.text);
    } else {
      return new AIMessage(message.text);
    }
  });
  messages_formated = [...messages_formated, new HumanMessage(input)];
  console.log(messages_formated);
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant. Answer all questions to the best of your ability.",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  const chain = prompt.pipe(model);
  const response = await chain.stream({
    messages: messages_formated,
  });

  // const response = await model.stream(input);

  async function* streamGenerator() {
    let res = "";
    for await (const item of response) {
      res += item.content;
      yield res;
    }
  }
  return streamGenerator();
}

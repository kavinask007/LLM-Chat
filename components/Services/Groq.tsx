import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function getChatStream(
  input: string,
  api_key: string,
  modelname:string
): Promise<AsyncGenerator<string>> {
  const model = new ChatGroq({
    apiKey: api_key,
    model: modelname
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["human", input],
  ]);

  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.stream({
    input,
  });

  async function* streamGenerator() {
    let res = "";
    for await (const item of response) {
      res += item;
      yield res;
    }
  }

  return streamGenerator();
}

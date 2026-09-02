import { ChatGroq } from "@langchain/groq";

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0.2,
  maxRetries: 2,
});

export default llm;
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../configs/llm.js";
import searchVideo from "../configs/youtube.js";

const resourceAgent = async (state) => {
  try {
    const roadmap = state.roadmap;

    const moduleTitles = roadmap.modules
      .map((module) => module.title)
      .join("\n");

    const docsResponse = await llm.invoke([
      new SystemMessage(`
You are an expert software engineer.

For every module below return the official documentation.

Rules:

1. Prefer official documentation.
2. If official documentation does not exist, return the best learning article.
3. Return ONLY valid JSON.
4. Do not explain anything.
5. Keep the same title.

Return format:

[
  {
    "title": "",
    "article": ""
  }
]
`),

      new HumanMessage(`Modules: ${moduleTitles}`),
    ]);

    let docs = [];

    try {
      docs = JSON.parse(
        docsResponse.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
    } catch (error) {
      console.log("Failed to parse documentation response:", error.message);
      docs = [];
    }

    // Map module title -> article URL
    const docsMap = new Map();

    docs.forEach((item) => {
      if (item.title && item.article) {
        docsMap.set(item.title.toLowerCase(), item.article);
      }
    });

    roadmap.modules = await Promise.all(
      roadmap.modules.map(async (module) => {
        let video = null;

        try {
          video = await searchVideo(module.title);
        } catch (error) {
          console.log("YouTube search error:", error.message);
        }

        return {
          ...module,
          youtube: video?.url || "",
          article: docsMap.get(module.title.toLowerCase()) || "",
        };
      })
    );

    return {
      ...state,
      roadmap,
    };
  } catch (error) {
    console.log("Resource Agent Error:", error);
    return state;
  }
};

export default resourceAgent;
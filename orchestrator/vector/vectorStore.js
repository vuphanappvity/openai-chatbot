import { OpenAI } from "openai";
import { OPENAI_API_KEY, VECTOR_STORE_ID } from "../../configs/openai.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function getVectorContext(prompt) {
  if (!VECTOR_STORE_ID) {
    return "";
  }
  try {

    const vectorStore = await openai.vectorStores.search(VECTOR_STORE_ID, {
      query: prompt,
      max_num_results: 5,
      rewrite_query: true,
      ranking_options: {
        ranker: "auto",
        score_threshold: 0.6,
      },
    });

    const results = vectorStore.data.reduce((acc, item) => {
      acc.push(item.content?.[0]?.text || "");
      return acc;
    }, []);

    const summary = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that summarizes context information into concise key points.",
        },
        {
          role: "user",
          content: `Summarize the following context information into concise key points:\n\n${results.join(
            "\n\n"
          )}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.5,
    });

    return summary.choices[0].message.content.trim();
  } catch (error) {
    console.error("Failed to initialize OpenAI Vector Store:", error);
    throw error;
  }
}


import OpenAI from "openai";
import { prompt } from "../utils/getPrompt";
import { taskType } from "../utils/types";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarize = async (task: taskType)=>{
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "system",
            "content": prompt
          },
          {
            "role": "user",
            "content": `${task.content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });

      return response.choices[0].message;
}



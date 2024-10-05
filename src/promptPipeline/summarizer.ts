
import OpenAI from "openai";
import { TaskType } from "./taskQueueHandler";
import { prompt } from "../utils/getPrompt";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarize = async (task: TaskType)=>{
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



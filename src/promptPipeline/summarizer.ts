
import OpenAI from "openai";
import { taskType } from "../utils/types";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `You are a helpful assistant to summarize the key insights from this financial article in a clear and concise manner. 
    Highlight the most important information, such as market trends, investment opportunities, risks, and economic factors. 
    Ensure the summary is simple and easy to understand for a reader with basic financial knowledge, 
    avoiding overly technical jargon while still providing meaningful insights. From the given below data that is scrapped from 
    webpage of an article. Remember to keep the summary under 150 words.`;


export const summarize = async (task: taskType)=>{
  try {
      const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: task.content
            }
        ],
        temperature: 0.5,
        top_p: 0.1
    })
    
    return response.choices[0].message.content;
    
  } catch (error) {
    console.error("Error in summarize function caused an error", error);
  }
}



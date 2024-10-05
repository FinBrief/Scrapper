import { json } from "express";
import { getRedisClient } from "../dbClient"
import { summarize } from "./summarizer";

export interface TaskType {
    source: string;
    title: string;
    pubDate: number;
    link: string;
    content: Element;
}


export const taskHandler = async ()=>{
    const client = getRedisClient();

    const numberOfTasks = await client.LLEN("taskQueue");

    for(let i=0;i<numberOfTasks;i++){
        const stringifiedtask = await client.rPop("taskQueue");

        const task:TaskType = JSON.parse(stringifiedtask|| '');

        const summary = await summarize(task);

        //db call to save this in RDB
    }
}
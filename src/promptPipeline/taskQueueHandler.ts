import { getRedisPool } from '../dbClient';
import { summarize } from './summarizer';

export interface TaskType {
    source: string;
    title: string;
    pubDate: number;
    link: string;
    content: Element;
}

export const taskHandler = async () => {
    const pool = getRedisPool();
    const client = await pool.acquire();

    try {
        const numberOfTasks = await client.LLEN("taskQueue");

        for (let i = 0; i < numberOfTasks; i++) {
            const stringifiedTask = await client.rPop("taskQueue");
            const task: TaskType = JSON.parse(stringifiedTask || '');

            const summary = await summarize(task);

            // db call to save this in RDB
        }
    } finally {
        pool.release(client);
    }
}; 
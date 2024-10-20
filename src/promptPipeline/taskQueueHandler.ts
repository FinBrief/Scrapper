import { summarize } from './summarizer';
import { prismaClient as prisma } from '..';
import { taskQueue } from '../utils/initInmemoryVars';
import { taskType } from '../utils/types';




export const taskHandler = async () => {

    try {
        const numberOfTasks = taskQueue.length;

        for (let i = 0; i < numberOfTasks; i++) {
            
            const task: taskType = taskQueue[i];

            console.log("Processing task: ", task.title);

            const summary = await summarize(task);

            await prisma.post.create({
                data: {
                    title: task.title,
                    source: {
                        connect:{
                            name: task.source
                        }
                    },
                    pubDate: new Date(Number(task.pubDate)),
                    link: task.link,
                    summary: summary|| "",
                }
            })
        }
    } catch (e) {
        console.error("Error in taskHandler function caused an error", e);
    }
}; 
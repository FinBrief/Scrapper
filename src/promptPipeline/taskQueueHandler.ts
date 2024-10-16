import { summarize } from './summarizer';
import { prismaClient as prisma } from '..';
import { taskQueue } from '../utils/initInmemoryVars';
import { tasktype } from '../scrape/contentScrapper';



export const taskHandler = async () => {

    try {
        const numberOfTasks = taskQueue.length;

        for (let i = 0; i < numberOfTasks; i++) {
            
            const task: tasktype = taskQueue[i];

            const summary = await summarize(task);

            await prisma.post.create({
                data: {
                    title: task.title,
                    source: {
                        connect:{
                            name: task.source
                        }
                    },
                    // make sure here over flow is not possible
                    //??????????? very important
                    pubDate: new Date(Number(task.pubDate)),
                    link: task.link,
                    summary: summary.content|| "",
                }
            })
        }
    } finally {
    }
}; 
import { itemType } from "./rss";
import puppeteer from "puppeteer";
import { contentLocationMap, feedQueue, taskQueue } from "../utils/initInmemoryVars";

export type tasktype = itemType & {content: string};


export const scrapeContent = async () => {

    try {
        console.log("Scraping content");
        
        const n = feedQueue.length;
        //console.log("Feed queue length: ", n);
        for(let i=0;i<n;i++){
            const item = feedQueue[i];
            //const articleContent = await getPageContents(item.link, item.source);
            console.log("pushed into the task queue: ", item.title);
            // taskQueue.push({
            //     ...item,
            //     content: articleContent || ""
            // })
        }
        
    } catch (e) {
        console.error(e);
    }
};


const getPageContents = async (url: string, source: string) => {

    try {
        
        const location = contentLocationMap.get(source);

        if(!location){
            throw new Error("Location not found");
        }

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        // Use a dot to target class selector
        await page.waitForSelector(location); 

        const content = await page.evaluate((location) => {
            const contentElement = document.querySelector(location); // Use the parameter properly
            return contentElement ? contentElement.innerHTML : null; // Extract the innerHTML
        }, location);

        await browser.close();
        return content;
    }catch(e){
        console.error(e);
    }
};


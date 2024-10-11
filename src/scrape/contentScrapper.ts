import { RedisClientType } from "redis";
import { getRedisPool } from "../dbClient"
import { itemType } from "./rss";
import puppeteer from "puppeteer";
import { contentLocationMap } from "../utils/initInmemoryVars";


export const scrapeContent = async () => {
    const pool = getRedisPool();
    const client = await pool.acquire();

    try {
        const numberOfItems = await client.LLEN("feedQueue");

        for (let i = 0; i < numberOfItems; i++) {
            const value = await client.rPop("feedQueue");
            const item: itemType = JSON.parse(value || "");
            //puppeteer code
            const articleContent = await getPageContents(item.link, item.source);

            await client.lPush("taskQueue", JSON.stringify({
                ...item,
                content: articleContent
            }));
        }
    } finally {
        pool.release(client);
    }
};

/*
const contentlocation = {
    contentElement: Map<string,string> 
}
    map eg -> "cnbc" : "class"
    this can go in add feed end point
 */

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


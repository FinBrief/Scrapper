import { RedisClientType } from "redis";
import { getRedisClient } from "../dbClient"
import { itemType } from "./rss";
import puppeteer from "puppeteer";


export const scrapeContent =  async ()=>{
    const client = getRedisClient();

    const numberOfItems = await client.LLEN("feedQueue");

    for(let i=0;i<numberOfItems;i++){
        const value = await client.rPop("feedQueue");
        //try-catch necessary
        const item :itemType = JSON.parse(value || "");

        //puppeteer action
        const articleContent = await getPageContents(item.link,item.source);

        await client.lPush("taskQueue",JSON.stringify({
            ...item,
            content: articleContent
        }))
    }

}

/*
const contentlocation = {
    contentElement: Map<string,string> 
}
    map eg -> "cnbc" : "class"
    this can go in add feed end point
 */

const getPageContents = async(url:string, source: string)=>{

    const client = getRedisClient();

    const response = await client.get('contentLocation');
    
    const transformedRes = JSON.parse(response || '');

    const divClass = transformedRes.contentElement.get(source)

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the news article page and wait for the necessary resources to load
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the article content to be rendered by client-side JavaScript
    await page.waitForSelector('.'+divClass); // Adjust selector to fit the structure of the page

    // Scrape the article title
    const content = await page.evaluate(() => {
        const content = document.querySelector('.'+divClass);
        return content
    });

    return content
}

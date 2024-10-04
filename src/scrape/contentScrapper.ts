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
        await getPageContents(item.link);
    }

}


const getPageContents = async(url:string)=>{
    // Launch a browser instance
 
}

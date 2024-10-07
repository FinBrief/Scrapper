import { RedisClientType } from "redis";
import { getRedisPool } from "../dbClient"
import { itemType } from "./rss";
import puppeteer from "puppeteer";


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
    const pool = getRedisPool();
    const client = await pool.acquire();

    try {
        const response = await client.get('contentLocation');
        const transformedRes = JSON.parse(response || '');
        const divClass = transformedRes.contentElement.get(source);

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.' + divClass);

        const content = await page.evaluate(() => {
            const content = document.querySelector('.' + divClass);
            return content;
        });

        await browser.close();
        return content;
    } finally {
        pool.release(client);
    }
};



import puppeteer from "puppeteer-extra";
import { contentLocationMap, feedQueue, taskQueue } from "../utils/initInmemoryVars";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());


export const scrapeContent = async () => {

    try {
        console.log("Scraping content");
        
        const n = feedQueue.length;
        //console.log("Feed queue length: ", n);
        for(let i=0;i<n;i++){
            const item = feedQueue[i];
            const articleContent = await getPageContents(item.link, item.source);
            if(!articleContent){
                console.error("Failed to fetch content for: ", item.title);
                continue;
            }
            console.log("pushed into the task queue: ", item.title);
            taskQueue.push({
                ...item,
                summary: articleContent
            })
        }
        
    } catch (e) {
        console.error(e);
    }
};



const getPageContents = async (url:string, source:string) => {
    try {
        const location = contentLocationMap.get(source);
        if (!location) {
            throw new Error("Location not found");
        }

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const retries = 7;
        let content;

        for (let i = 0; i < retries; i++) {
            try {
                //console.log(`Attempt ${i+1} for URL: ${url}`);
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
                await page.waitForSelector(location, { timeout: 5000 });
                
                content = await page.evaluate((location) => {
                    try {
                        const contentElement = document.querySelector(location);
                        return contentElement ? contentElement.innerHTML : null;
                    } catch (e) {
                        return null;
                    }
                }, location);
                console.log('scrapping successfull: ',url);
                if (content) break; // Exit loop if content is successfully fetched
            } catch (e) {
                //console.error(`Retry ${i+1} failed for URL: ${url}`, e);
            }
        }

        await browser.close();
        return content;
    } catch (e) {
        console.error(e);
    }
};



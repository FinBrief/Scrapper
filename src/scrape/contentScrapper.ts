
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
                content: articleContent
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

        const browser = await puppeteer.launch({ 
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
         });
        const page = await browser.newPage();
        const retries = 7;
        let content;

        for (let i = 0; i < retries; i++) {
            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 7000 });
                await page.waitForSelector(location, { timeout: 3000 });
                
                content = await page.evaluate((location) => {
                    try {
                        const contentElement = document.querySelector(location);
                        return contentElement ? contentElement.textContent : null;
                    } catch (e) {
                        return null;
                    }
                }, location);
                console.log('scrapping successfull: ',url);
                if (content) break; 
            } catch (e) {
            }
        }

        await browser.close();
        return content;
    } catch (e) {
        console.error(e);
    }
};



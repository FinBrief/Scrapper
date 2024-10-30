import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { itemType } from "../utils/types";

puppeteer.use(StealthPlugin());

export const scrapePulse = async () => {
  try {
    const url = "https://pulse.zerodha.com/";
    const selector = "#news";
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const retries = 2;
    let items: itemType[] = [];

    for (let i = 0; i < retries; i++) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 7000 });
        await page.waitForSelector(selector, { timeout: 3000 });
        
        items = await page.evaluate((selector) => {
          const newsList = document.querySelector(selector);
          if(!newsList) return [];

          const newsItems = Array.from(newsList.querySelectorAll("li.box"));

          return newsItems.map((item)=>{
            const title = item.querySelector("h2.title a")?.textContent || "";
            const link = item.querySelector("h2.title a")?.getAttribute("href") || "";
            const content = item.querySelector("div.desc")?.textContent || "";
            const pubDate = item.querySelector("span.date")?.getAttribute("title") || "";
            const source = item.querySelector("span.feed")?.textContent?.replace('—','').trim() || "";

            return {title, link, content, pubDate, source};
          });
        }, selector);
        
        console.log("content: ", items);
        console.log('Pulse scrapping successfull');

        if (items.length > 0) break; // Exit loop if content is successfully fetched
      } catch (e) {
          //console.error(`Retry ${i+1} failed for URL: ${url}`, e);
      }
    }
    await browser.close();
    return items;
  } catch (e) {
    console.error(e);
    return [];
  }
}


import Parser from 'rss-parser';
import { getRedisPool } from '../dbClient';
import { RedisClientType } from 'redis';

export interface itemType {
    source: string;
    title: string;
    pubDate: number;
    link: string;
}

// export interface LatestTimeMap {
//     map: Map<string, number>;
// }

export const extractRssFeed = async (feedLink: string, source: string) => {
    const parser = new Parser();
    const feed = await parser.parseURL(feedLink);
    const pool = getRedisPool();
    const client = await pool.acquire();

    try {
        const latestTimeMapStringified = await client.get("latestTimePost");
        let latestTimeMap;

        if(latestTimeMapStringified === null){ // this will run only the for the first time
            latestTimeMap = new Map<string, number>();
            
        }
        else{
            const obj = JSON.parse(latestTimeMapStringified);
            latestTimeMap = new Map<string, number>(Object.entries(obj.map));
        }
        const latestTime = latestTimeMap.get(feedLink) || -1;

        feed.items.forEach(async (item) => {
            const date = Date.parse(item.pubDate || "");
            if (date <= latestTime) {
                return;
            }

            const entity: itemType = {
                source,
                title: item.title || '',
                pubDate: date,
                link: item.link || ''
            };
            //console.log("pushed into the task queue: " + entity.title );
            await client.lPush("feedQueue", JSON.stringify(entity));
        });

        const latestItemPubDate = feed.items[0].pubDate;
        const newLatestTime = Date.parse(latestItemPubDate || "");
        latestTimeMap.set(feedLink, newLatestTime);
        const obj = {
            map: Object.fromEntries(latestTimeMap)
        }
        await client.set("latestTimePost", JSON.stringify(obj));
    }
    catch (e) {
        console.log("Error in extractRssFeed function caused an error", e);
    }
    finally {
        pool.release(client);
    }
};
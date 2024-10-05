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
        let latestTime = -1;
        if(latestTimeMapStringified !== null){
            const latestTimeMap = JSON.parse(latestTimeMapStringified);
            latestTime = latestTimeMap.map.get(feedLink) || -1;
        }

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

            await client.lPush("feedQueue", JSON.stringify(entity));
        });
    } finally {
        pool.release(client);
    }
};
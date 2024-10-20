import Parser from 'rss-parser';
import { feedQueue, latestTimeMap } from '../utils/initInmemoryVars';
import { itemType } from '../utils/types';



export const extractRssFeed = async (feedLink: string, source: string) => {
    const parser = new Parser();
    const feed = await parser.parseURL(feedLink);

    try {
        const latestTime = BigInt(latestTimeMap.get(feedLink)|| -1);

        feed.items.forEach(async (item) => {
            const date = BigInt(Date.parse(item.pubDate || ""));
            if (date <= latestTime) {
                return;
            }

            const entity: itemType = {
                source,
                title: item.title || '',
                pubDate: date,
                link: item.link || '',
                content: item.content
            };
            // console.log("description: ", item.description);
            // console.log("summary: ", item.summary);
            // console.log("date",item.isoDate);
            // console.log("content: ", item.content);
            // console.log("categories: ", item.categories );

            console.log("pushed into the feed queue: " + entity.title );
            feedQueue.push(entity);
        });

        const latestItemPubDate = feed.items[0].pubDate;
        const newLatestTime = BigInt(Date.parse(latestItemPubDate || ""));
        console.log("new latest time: ", newLatestTime);
        latestTimeMap.set(feedLink, newLatestTime);
        
    }
    catch (e) {
        console.log("Error in extractRssFeed function caused an error", e);
    }
    finally {
    }
};
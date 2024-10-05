import Parser from 'rss-parser'
import { getRedisClient } from '../dbClient';

export interface itemType{
    source: string;
    title: string;
    pubDate: number;
    link: string;
}


export const extractRssFeed = async (feedLink:string, source: string)=>{
    const parser = new Parser();
    const feed = await parser.parseURL(feedLink);
    const client = getRedisClient();

    //date constraint to be added
    // source to be passed

    feed.items.forEach(async(item) =>{
        const date = Date.parse(item.pubDate || "");
        const entity:itemType = {
            source,
            title: item.title || '',
            pubDate: date,
            link: item.link || ''
        }

        await client.lPush("feedQueue",JSON.stringify(entity));
    })
}
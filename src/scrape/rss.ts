import Parser from 'rss-parser'
import { getRedisClient } from '../dbClient';

export interface itemType{
    title: string,
    pubDate: number;
    link: string;
}


const extractRssFeed = async (feedLink:string)=>{
    const parser = new Parser();
    const feed = await parser.parseURL(feedLink);
    const client = getRedisClient();

    //date constraint to be added

    feed.items.forEach(async(item) =>{
        const date = Date.parse(item.pubDate || "");
        const entity:itemType = {
            title: item.title || '',
            pubDate: date,
            link: item.link || ''
        }

        await client.lPush("feedQueue",JSON.stringify(entity));
    })
}
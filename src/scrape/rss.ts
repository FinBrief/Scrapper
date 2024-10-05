import Parser from 'rss-parser'
import { getRedisClient } from '../dbClient';

export interface itemType{
    source: string;
    title: string;
    pubDate: number;
    link: string;
}

export interface LatestTimeMap{
    map: Map<string,number>
}

export const extractRssFeed = async (feedLink:string, source: string)=>{
    const parser = new Parser();
    const feed = await parser.parseURL(feedLink);
    const client = getRedisClient();

    //date constraint to be added
    // source to be passed
    const latestTimeMapStringified = await client.get("latestTimePost");
    const latesTimeMap: LatestTimeMap= JSON.parse(latestTimeMapStringified|| '');
    const latestTime = latesTimeMap.map.get(feedLink)|| -1;

    feed.items.forEach(async(item) =>{
        const date = Date.parse(item.pubDate || "");
        //to not double inject the same article in to the pipeline
        if(date<=latestTime){
            return;
        }

        const entity:itemType = {
            source,
            title: item.title || '',
            pubDate: date,
            link: item.link || ''
        }

        await client.lPush("feedQueue",JSON.stringify(entity));
    })
}
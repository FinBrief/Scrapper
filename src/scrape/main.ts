import { json } from "express"
import { getRedisClient } from "../dbClient"
import { extractRssFeed } from "./rss"
import { scrapeContent } from "./contentScrapper"


type sourceListType = {
    sourceList: Array<string>
}
type rssLinksType = {
    map: Map<string,Array<string>>
}
/**?
 * const rssLinks = {
 *  map: Map<string,Array>
 *
 * }
 * string -> source, Array-> ['rss feed links']
 * 
 * const sources = {
 *  sourceList: Array<string>
 * }
 */
export const main = async ()=>{
    const client = getRedisClient();

    const stringifiedsources = await client.get('sources')

    const sources: sourceListType = JSON.parse(stringifiedsources || '')
    const sourceList = sources.sourceList;

    const stringifiedRssLinks = await client.get('rssLinks');
    const rssLinks: rssLinksType = JSON.parse(stringifiedRssLinks || '');
    const rssMap = rssLinks.map;

    const n = sourceList.length;

    for(let i =0;i<n;i++){
        //list of all the rss feeds for a particular new agency or source
        const linkList = rssMap.get(sourceList[i]);
        if(linkList===undefined){
            continue;
        }
        const m = linkList.length;
        for(let j=0;j<m;j++){
            await extractRssFeed(linkList[j],sourceList[i])
        }
    }

    await scrapeContent()

}
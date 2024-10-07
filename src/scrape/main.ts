import { getRedisPool } from "../dbClient"
import { extractRssFeed } from "./rss"
import { scrapeContent } from "./contentScrapper"
import { taskHandler } from "../promptPipeline/taskQueueHandler"


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
    const pool = getRedisPool();
    const client = await pool.acquire();

    try{

        //get all the sources
        const stringifiedsources = await client.get('sources')
        if(stringifiedsources===null){
            throw new Error("No sources found")
        }
        const sources: sourceListType = JSON.parse(stringifiedsources)
        const sourceList = sources.sourceList;

        //get all the rss feeds
        const stringifiedRssLinks = await client.get('rssLinks');
        if(stringifiedRssLinks===null){
            throw new Error("No rss links found")
        }
        const rssLinks = JSON.parse(stringifiedRssLinks);
        const rssMap = new Map<string,Array<string>>(Object.entries(rssLinks.map));

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

        //makes no sense to parallelize this as we are only using single thread.

        await scrapeContent()

        //await taskHandler()
       
    }catch(e){
        console.log(e)
    }finally {
        pool.release(client);
    }
    
}
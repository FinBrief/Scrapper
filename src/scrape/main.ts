import { getRedisPool } from "../dbClient"
import { extractRssFeed } from "./rss"
import { scrapeContent } from "./contentScrapper"
import { taskHandler } from "../promptPipeline/taskQueueHandler"
import { initInmemoryVars, updateVarsPostProcess } from "../utils/initInmemoryVars"
import { sources } from "../utils/initInmemoryVars"
import { rssLink } from "../utils/initInmemoryVars"

export const main = async ()=>{
    try{

        await initInmemoryVars();

        const n = sources.length;

        for(let i =0;i<n;i++){
            //list of all the rss feeds for a particular new agency or source
            const linkList = rssLink.get(sources[i]);
            if(linkList===undefined){
                continue;
            }
            const m = linkList.length;
            for(let j=0;j<m;j++){
                await extractRssFeed(linkList[j],sources[i])
            }
        }

        await scrapeContent()

        //await taskHandler()

        await updateVarsPostProcess()
       
    }catch(e){
        console.log(e)
    }
    
}
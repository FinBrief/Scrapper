import { getRedisPool } from "../dbClient";
import { addSource } from "./addSource";


export const addFeed = async (source: string, rssLink: string) => {
    //auth
    // add in rssLinks -> rssMap
    const pool = getRedisPool();
    const client = await pool.acquire();
    try {
        await addSource(source);
        const stringifiedRssLinks = await client.get('rssLinks');
        if (stringifiedRssLinks === null) {
            const myMap = new Map<string, Array<string>>();
            myMap.set(source, [rssLink]);
            //serisalizing the map and store it in redis, because Map cannot be stringified directly
            const rssLinks = {
                map: Object.fromEntries(myMap)
            }
            await client.set('rssLinks', JSON.stringify(rssLinks));
            return;
        }
        const rssLinks = JSON.parse(stringifiedRssLinks);
        //deserisalizing the map
        const rssMap = new Map<string, Array<string>>(Object.entries(rssLinks.map));

        const linkList = rssMap.get(source);
        if(linkList===undefined){
            rssMap.set(source,[rssLink]);
        }else{
            linkList.push(rssLink);
            rssMap.set(source, linkList);
        }
        //serisalizing the map and store it in redis
        rssLinks.map = Object.fromEntries(rssMap);

        await client.set('rssLinks', JSON.stringify(rssLinks));
    }catch(e){
        console.log("Problem in addFeed Function caused an error");
    }
     finally {
        pool.release(client);
    }
}
import { getRedisPool } from "../dbClient";


export const addSource = async (source: string) => {
    //auth
    // add in sources -> sourceList
    const pool = getRedisPool();
    const client = await pool.acquire();
    try {
        const stringifiedsources = await client.get('sources')
        if (stringifiedsources === null) {
            const sources = {
                sourceList: [source]
            }
            await client.set('sources', JSON.stringify(sources));
            return;
        }
        const sources = JSON.parse(stringifiedsources);
        const sourceList:Array<string> = sources.sourceList;
        const alreadyExists = sourceList.find((s)=>s===source);
        if(alreadyExists){
            return;
        }
        sourceList.push(source);
        await client.set('sources', JSON.stringify(sources));
    }catch(e){
        console.log(e);
    } 
    finally {
        pool.release(client);
    }
}
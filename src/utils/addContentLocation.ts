import { getRedisPool } from "../dbClient";


export const addContentLocation = async (source: string, contentLocation: string) => {
    //auth
    // add in contentlocation -> contentElement
    const pool = getRedisPool();
    const client = await pool.acquire();
    try {
        const stringifiedContentLocation = await client.get('contentLocation')
        if (stringifiedContentLocation === null) {
            const myMap = new Map<string, string>();
            myMap.set(source, contentLocation);
            const obj = {
                contentElement: Object.fromEntries(myMap)
            }
            await client.set('contentLocation', JSON.stringify(obj));
            return;
        }

        const contentmapStringified = JSON.parse(stringifiedContentLocation);
        const contentMap = new Map<string, string>(Object.entries(contentmapStringified.contentElement));
        const alreadyExists = contentMap.get(source);
        if (alreadyExists) {
            return;
        }
        contentMap.set(source, contentLocation);
        const obj = {
            contentElement: Object.fromEntries(contentMap)
        }
        await client.set('contentLocation', JSON.stringify(contentMap));
    } catch (e) {
        console.log(e);
    }
    finally {
        pool.release(client);
    }
}
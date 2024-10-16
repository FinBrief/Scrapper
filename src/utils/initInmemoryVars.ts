import { prismaClient as prisma } from "..";



export const sources : Array<string> = [];
export const rssLink : Map<string,Array<string>> = new Map<string,Array<string>>();
export const contentLocationMap : Map<string,string> = new Map<string,string>(); 
export const latestTimeMap : Map<string,number> = new Map<string,number>();


export const initInmemoryVars = async ()=>{
    //clearting the inmemory variables
    sources.length = 0;
    rssLink.clear();
    contentLocationMap.clear();
    latestTimeMap.clear();
    

    const sourceObjectArray = await prisma.sources.findMany();
    //sources array initialized
    sourceObjectArray.forEach((sourceObject)=>{
        sources.push(sourceObject.name);
    })

    const rssLinkObjectArray = await prisma.rssLinks.findMany({
        include:{
            source:true
        }
    });

    //rssLink map initialized
    rssLinkObjectArray.forEach((rssLinkObject)=>{
        const linkArray = rssLink.get(rssLinkObject.source.name);
        if(linkArray===undefined){
            rssLink.set(rssLinkObject.source.name,[rssLinkObject.link]);
        }else {
            rssLink.set(rssLinkObject.source.name,[...linkArray,rssLinkObject.link]);
        }
    })

    //contentLocationMap initialized
    sourceObjectArray.forEach((sourceObject)=>{
        contentLocationMap.set(sourceObject.name,sourceObject.contentLocation);
    })

    //latestTimeMap initialized
    rssLinkObjectArray.forEach((rssLinkObject)=>{
        latestTimeMap.set(rssLinkObject.link,rssLinkObject.latestPostTime);
    })
} 


// remember to call this function after the process completes
export const updateVarsPostProcess = async ()=>{
    const rssLinkObjectArray = await prisma.rssLinks.findMany();
    // update latestPostTime in rssLinks table in db;
    rssLinkObjectArray.forEach(async(rssLinkObject)=>{
        await prisma.rssLinks.update({
            where:{
                id:rssLinkObject.id
            },
            data:{
                latestPostTime:latestTimeMap.get(rssLinkObject.link)
            }
        })
    })
}
import { prismaClient as prisma } from "..";
import { tasktype } from "../scrape/contentScrapper";
import { itemType } from "../scrape/rss";

// In-memory queues instead of redis
export const feedQueue : Array<itemType> = [];
export const taskQueue : Array<tasktype> = [];

// In-memory variables for sources, rssLinks, contentLocationMap and latestTimeMap
export const sources : Array<string> = [];
export const rssLink : Map<string,Array<string>> = new Map<string,Array<string>>();
export const contentLocationMap : Map<string,string> = new Map<string,string>(); 
export const latestTimeMap : Map<string,bigint> = new Map<string,bigint>();


export const initInmemoryVars = async ()=>{
    try{

        //clearting the inmemory variables
        feedQueue.length = 0;
        taskQueue.length = 0;
        sources.length = 0;
        rssLink.clear();
        contentLocationMap.clear();
        latestTimeMap.clear();
        console.log("Inmemory variables cleared");
    
        const sourceObjectArray = await prisma.sources.findMany();
        //sources array initialized
        sourceObjectArray.forEach((sourceObject)=>{
            sources.push(sourceObject.name);
        })
        console.log("Sources array initialized");
    
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
        console.log("rssLink map initialized");
    
        //contentLocationMap initialized
        sourceObjectArray.forEach((sourceObject)=>{
            contentLocationMap.set(sourceObject.name,sourceObject.contentLocation);
        })
        console.log("contentLocationMap initialized");
    
        //latestTimeMap initialized
        rssLinkObjectArray.forEach((rssLinkObject)=>{
            latestTimeMap.set(rssLinkObject.link,rssLinkObject.latestPostTime);
        })
        console.log("latestTimeMap initialized");
    }catch(error){
        console.log("Error in initializing the inmemory variables",error);
        process.exit(1);
    }

} 


// remember to call this function after the process completes
export const updateVarsPostProcess = async () => {
    try {
      console.log("Updating the in-memory variables post process");
  
      // Fetch all rssLink objects
      const rssLinkObjectArray = await prisma.rssLinks.findMany();
      const n = rssLinkObjectArray.length;

      for(let i=0;i<n;i++){
          //console.log(rssLinkObjectArray[i]);
          await prisma.rssLinks.update({
            where: {
              link: rssLinkObjectArray[i].link,
            },
            data: {
              //latestPostTime: latestTimeMap.get(rssLinkObjectArray[i].link),
              // integer overflow issue is causing the error in the below line
              latestPostTime:{
                set:latestTimeMap.get(rssLinkObjectArray[i].link)
              }
            },
          });
      }
  
    } catch (error) {
      console.log("Error in updating the in-memory variables post process", error);
    }
  };
  
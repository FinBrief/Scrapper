import { prismaClient as prisma } from "..";
import Parser from "rss-parser";

export const addFeed = async (source: string, rssLink: string) => {
    try {

        const parser = new Parser();
        const feed = await parser.parseURL(rssLink);
        
        const existingFeed = await prisma.rssLinks.findFirst({
            where:{
                link: rssLink
            }
        })
        if(existingFeed){
            throw new Error("Feed already exists")
        }
        const sourceobj = await prisma.sources.findFirst({
            where:{
                name: source
            }
        })
        if(!sourceobj){
            throw new Error("Source does not exist")
        }
        await prisma.rssLinks.create({
            data:{
                name: feed.title || "",
                link: rssLink,
                source: {
                    connect:{
                        name: source
                    }
                }
            }
        })
        
    } catch (error) {
        console.log("Some problem was caused in adding the feed",error);
    }
}
import { prismaClient as prisma} from "..";



export const addSource = async (source: string, contentLocation:string) => {
    try {
        const existingSources = await prisma.sources.findFirst({
            where:{
                name: source
            }
        });
        if(existingSources){
            throw new Error("Source already exists");
        }
        await prisma.sources.create({
            data:{
                name: source,
                contentLocation
            }
        })
        
    } catch (error) {
        console.log("Some problem was caused in adding the source",error);
    }
    
}
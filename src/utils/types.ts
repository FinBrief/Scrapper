import z from 'zod';

export const addFeedSchema = z.object({
    source: z.string({message: "source should be a string"}),
    feedLink: z.string({message: "feedLink should be a string"})
});

export const addSourceSchema = z.object({
    source: z.string({message: "source should be a string"}),
    //implictly add .-> class, #-> id and nothing for tag;
    contentLocation: z.string({message: "contentLocation should be a string"})
});

export interface itemType {
    source: string;
    title: string;
    pubDate: bigint | string;
    link: string;
    content: string; 
}

export type taskType = itemType & {summary?: string};
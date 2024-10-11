import express from 'express';
import {config } from 'dotenv';
import { getRedisPool } from './dbClient';
import { main } from './scrape/main';
import { addFeed } from './utils/addFeed';
import { addSource } from './utils/addSource';
import { PrismaClient } from '@prisma/client';
import { initInmemoryVars } from './utils/initInmemoryVars';


config();

export const prismaClient = new PrismaClient();

const app = express();

const pool = getRedisPool();

app.use(express.json());
const PORT = parseInt(process.env.PORT|| '');


app.get('/health-check',(req,res)=>{

    res.json({
        message: "Server is alive"
    })
})

app.get("/get-new-articles",async (req,res)=>{

    await initInmemoryVars();

    main();

    res.json({
        message: "Started the process"
    })
})

app.post("/add-feed",async(req,res)=>{

     /**
     * expected 
     * body = {
     *  source: string,
     *  feedLink: string
     * }
     */
     const client = await pool.acquire();
     try {
        const {source, feedLink}:{source: string, feedLink:string} = req.body;
        await addFeed(source.toLowerCase(),feedLink);

        res.json({
            message: "Feed added successfully"
        })

     }catch(e){
        console.log("Some problem was caused in adding the feed");
     } finally {
         pool.release(client);
     }

    //auth
    // add in rssLinks -> rssMap
})

app.post("/add-source",async(req,res)=>{
    /**
     * expected 
     * body = {
     *  source: string,
     *  contentLocation: string
     * }
     */

    const client = await pool.acquire();
    try {
        const {source, contentLocation}:{source: string, contentLocation: string } = req.body;
        await addSource(source.toLowerCase(),contentLocation);

        res.json({
            message: "Source added successfully"
        })
        
    } catch (error) {
        
    }finally{
        pool.release(client);
    }

    
    //auth
    // add in sources -> sourceList
})

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
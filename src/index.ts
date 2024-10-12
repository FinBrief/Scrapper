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


app.get('/health-check',async(req,res)=>{

    try {
        await prismaClient.$connect();
        res.json({
            message: "Server and Database are alive"
        })
    } catch (error) {
        res.json({
            message: "Database is not alive"
        })
    }
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
     try {
        const {source, feedLink}:{source: string, feedLink:string} = req.body;
        await addFeed(source.toLowerCase(),feedLink);

        res.json({
            message: "Feed added successfully"
        })

     }catch(e){
        console.log("Some problem was caused in adding the feed");
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

    try {
        const {source, contentLocation}:{source: string, contentLocation: string } = req.body;
        await addSource(source.toLowerCase(),contentLocation);

        res.json({
            message: "Source added successfully"
        })
        
    } catch (error) {
        
    }

    
    //auth
    // add in sources -> sourceList
})

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
import express from 'express';
import {config } from 'dotenv';
import { getRedisPool } from './dbClient';
import { main } from './scrape/main';
import { addFeed } from './utils/addFeed';
import { addSource } from './utils/addSource';
import { PrismaClient } from '@prisma/client';
import { addFeedSchema, addSourceSchema } from './utils/requestTypes';


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

    main();

    res.json({
        message: "Started the process"
    })
})

app.post("/add-feed",async(req,res)=>{
    try {

        const {source,feedLink} = addFeedSchema.parse(req.body);
        await addFeed(source.toLowerCase(),feedLink);

        res.json({
            message: "Feed added successfully"
        })

    }catch(error){
        console.log("Some problem was caused in adding the feed",error);
    } 
})

app.post("/add-source",async(req,res)=>{

    try {
        const {source, contentLocation} = addSourceSchema.parse(req.body);

        //lowercasing the source just for consistency, so we by mistake do not add the same source with different cases
        await addSource(source.toLowerCase(),contentLocation);

        res.json({
            message: "Source added successfully"
        })
        
    } catch (error) {
        console.log("Some problem was caused in adding the source",error);
    }

})

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
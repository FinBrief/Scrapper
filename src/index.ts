import express from 'express';
import {config } from 'dotenv';
import { main } from './scrape/main';
import { addFeed } from './utils/addFeed';
import { addSource } from './utils/addSource';
import { PrismaClient } from '@prisma/client';
import { addFeedSchema, addSourceSchema } from './utils/types';
import { scrapePulse } from './scrape/pulse';


config();

const app = express();
const PORT = parseInt(process.env.PORT|| '');

app.use(express.json());

export const prismaClient = new PrismaClient();

app.get('/health-check', async(req,res) => {
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

app.get("/get-new-articles", async(req,res) => {

    main();

    res.json({
        message: "Started the process"
    })
})


//Different route for now, add to main
app.get("/scrape-pulse", async(req,res) => {
    try {
        res.json({
            message: "Started the process"
        })
        await scrapePulse();
    } catch (error) {
        console.log("Some problem was caused in scraping pulse", error);
    }
})

app.post("/add-feed", async(req,res) => {
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

app.post("/add-source", async(req,res) => {
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
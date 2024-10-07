import express from 'express';
import {config } from 'dotenv';
import { getRedisPool } from './dbClient';
import { main } from './scrape/main';
import { addFeed } from './utils/addFeed';


config();

const app = express();

const pool = getRedisPool();

app.use(express.json());
const PORT = parseInt(process.env.PORT|| '');


app.get('/health-check',(req,res)=>{

    res.json({
        message: "Server is alive"
    })
})

app.post("/get-new-articles",(req,res)=>{
    const body = req.body;

    main();

    res.json({
        message: "Started the process"
    })
    //auth
    //start process async
    //call main function here 
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

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
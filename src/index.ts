import express from 'express';
import {config } from 'dotenv';
import { getRedisPool } from './dbClient';


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
    //auth
    //start process async
    //call main function here 
})

app.post("/add-feed",async(req,res)=>{

     /**
     * expected 
     * body = {
     *  source: string,
     *  feedLink:  
     * }
     */
     const client = await pool.acquire();
     try {
         const body = req.body;
     } finally {
         pool.release(client);
     }

    //auth
    // add in rssLinks -> rssMap
})

app.post("/add-news-source",async(req,res)=>{
    /**
     * expected 
     * body = {
     *  source: string,
     *  contentLocation: string(class) 
     * }
     */

    //auth 
    // source 
    const client = await pool.acquire();
     try {
         const body = req.body;
     } finally {
         pool.release(client);
     }
})

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
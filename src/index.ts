import express from 'express';
import {config } from 'dotenv';
import { getRedisClient } from './dbClient';


config();

const app = express();

const client = getRedisClient();

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

app.post("/add-feed",(req,res)=>{

     /**
     * expected 
     * body = {
     *  source: string,
     *  feedLink:  
     * }
     */


    const body = req.body;
    //auth
    // add in rssLinks -> rssMap
})

app.post("/add-news-source",(req,res)=>{
    /**
     * expected 
     * body = {
     *  source: string,
     *  contentLocation: string(class) 
     * }
     */

    //auth 
    // source 
})

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
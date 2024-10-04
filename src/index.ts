import express from 'express';
import {config } from 'dotenv';


config();

const app = express();

app.use(express.json());
const PORT = parseInt(process.env.PORT|| '');


app.get('/health-check',(req,res)=>{

    res.json({
        message: "Server is alive"
    })
})

app.listen(PORT, ()=>{
    console.log("Scrapper running on port 3000");
})
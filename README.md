
# This is the Scrapper for FinBrief

~~- no need for redis queues, can use in memory arrays~~
- add retry functionality to the puppeteer client and handle the time out errors

## Run Locally(Always Follow)

Clone the project

```bash
  git clone https://github.com/FinBrief/Scrapper.git
```

Go to the project directory

```bash
  cd scrapper
```

To get Started locally (docker desktop must be running(for deamon to be active))

```bash
  npm run build
```

  
Start the server

```bash
  npm run start
```

## In-Memory Variables
```bash
  // In-memory queues instead of redis
  export const feedQueue : Array<itemType> = [];
  export const taskQueue : Array<tasktype> = [];

  // In-memory variables for sources, rssLinks, contentLocationMap and latestTimeMap
  export const sources : Array<string> = [];
  export const rssLink : Map<string,Array<string>> = new Map<string,Array<string>>();
  export const contentLocationMap : Map<string,string> = new Map<string,string>(); 
  export const latestTimeMap : Map<string,bigint> = new Map<string,bigint>();
```

## schema
![alt text](public/image.png)

 
## current stuck ups 
 - streamlining the propmpt pipeline


-> Brain Storming ideas and Features on - [doc](https://docs.google.com/document/d/1qqUtHU3fa_lNoeGDPQ69PCJvUnsbVg9sLhgE8C07Dek/edit?usp=sharing)



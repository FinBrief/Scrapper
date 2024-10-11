
# This is the Scrapper for FinBrief

## To start locally alwasys follow these steps(make sure docker command is working on your machine):
- npm run build
- npm run cache
- npm run start

## Some Better Ideas
 - Store all redis data in main Db then before each cycle pull it into in memory maps, then
    redis will only have queues 
 
## current stuck ups 
 - how to use prisma to connect to same db on tow different servers
 - designing tables to streamline the user Intreaction, and data requirements of the scrapper


-> No need for redis connection pool, can be done using a singleton

-> Brain Storming ideas and Features on - [doc](https://docs.google.com/document/d/1qqUtHU3fa_lNoeGDPQ69PCJvUnsbVg9sLhgE8C07Dek/edit?usp=sharing)


## what all exists in the Redis DB:
```bash

1 -> feedQueue 
  -> element = {
        source: string;
        title: string;
        pubDate: number;
        link: string;
    }

2 -> contentLocation
  -> element = {
        contentElement: Map<string,string>
    }  
    <source,class of content element>

3 -> taskQueue
  -> element = {
        ...item,
        content: Element | null
    }

4 -> rssLinks
  -> element = {
        rssMap: Map<string, Array of links >
    }

5 -> sources
  -> element = {
    sourceList : Array<string>

    }

6 -> latestTimePost
  -> element = {
        map: Map<string of rss feed link, number ie date in miliseconds>

    }
```
## Run Locally

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
  npm run prereqs
```

Start the server

```bash
  npm run start
```


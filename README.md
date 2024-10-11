
# This is the Scrapper for FinBrief

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

To start a redis container

```bash
  npm run cache
```
  
Start the server

```bash
  npm run start
```


## schema
![alt text](public/image.png)

 
## current stuck ups 
 - streamlining the propmpt pipeline


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


2 -> taskQueue
  -> element = {
        ...item,
        content: Element | null
    }

```


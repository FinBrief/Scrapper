# Might want to create individual redis clients for services as
while async process run in background it might happen that 2 services 
are trying to use the same redis client creating a synchronization issue


# try catch blocks are to be added

# Some Ideas for better scrapping
 - create a redis keyval map for newsAgency: (class where main content exist on page)
 - use langchain doc loader directly as a part of a chain


## no need for redis connection pool, can be don eusing a singleton

```bash
what all exists in my redis:

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
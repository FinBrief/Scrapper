# Might want to create individual redis clients for services as
while async process run in background it might happen that 2 services 
are trying to use the same redis client creating a synchronization issue


# try catch blocks are to be added

# Some Ideas for better scrapping
 - create a redis keyval map for newsAgency: (class where main content exist on page)
 - use langchain doc loader directly as a part of a chain
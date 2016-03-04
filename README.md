# gtfs-bus-stops

This project was made as a utility for me to better visualise the bus stops in my country.

It includes the following:
* A use of node-gtfs package: https://github.com/brendannee/node-gtfs
* A web application with a web interface to interact with google
  * The web application was made with NodeJS, Express and pure javascript for client side.

Note: In order to use this web app you'll need to do a several actions:
1. Use the node-gtfs to load the data to your web app.
2. go to ./views/bushotspots.jade and change the google API key there.
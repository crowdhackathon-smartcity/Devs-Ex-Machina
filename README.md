# Devs-Ex-Machina


## The product
We add smart buttons to public services in order to collect and store data for the amount of people waiting. We use this information to produce analytics that can be used from municipalities, public services and civilians, each for their own benefit.


## Technologies used
* Arduino
* Sentilo
* Node-red
  ![test](/nodered.png)

This is a short guide on how to install and use our code.

## Arduino
1. Download and install [Arduino IDE](https://www.arduino.cc/en/main/software)
1. Include esp8266 [addon](https://learn.sparkfun.com/tutorials/esp8266-thing-hookup-guide/installing-the-esp8266-arduino-addon)
1. Flash code from Arduino directory
1. Access the captive portal that was created from another device (ex smartphone) and point to the network of your choice
1. If connected successfully it's ready to use

## Sentilo
A preconfigured and ready to use VM can be found [here](http://www.sentilo.io/xwiki/bin/view/Sentilo.Community.Documentation/Use+a+Virtual+Machine). We used the destribution designed for Virtual Box. 
1. Download from the link above and import to Virtual Box. Follow the instrictions described on the link above.
1. Create a provider, some components and a couple of sensors
1. Check network connectivity and sentilo [API](http://www.sentilo.io/xwiki/bin/view/APIDocs/WebHome)

## Node-red
1. Follow [these](http://nodered.org/docs/getting-started/installation) instructions to get node-red up and running.
1. Install node for [mongodb](https://www.npmjs.com/package/node-red-node-mongodb) and [node-red-admin](https://www.npmjs.com/package/node-red-admin).
1. Edit settings.js to enable cross-origin resource sharing
1. Restart node-red and import flows from node-red directory
1. Use the injection nodes on "init db" flow to initialize the database
1. Dummy data will be generated if the nodes under "Generate dummy data" label are connected.

Now subscribe to sentilo data events using the IP of node-red instance, so that sentilo forwards data to our application. This can be done with curl:`curl -v -X PUT -d '{"endpoint":"http://83.212.123.145:1880/api/test"}' -H "Content-Type: application/json" -H "IDENTITY_KEY: 56d53610b761baebe67a40b70e4c5eba63e90dbc16c23bc1097da01e1033d205" http://192.168.1.65:8081/subscribe/data/kede_provider`
In the previous example:
* 83.212.123.145 is the IP of the machine where node-red was set
* 1880 is the default port where node-red is listening to
* 56d53610b761baebe67a40b70e4c5eba63e90dbc16c23bc1097da01e1033d205 was the sentilo provider's key
* 192.168.1.65 was the sentilo VM's IP
* 8081 is the default port where sentilo's API is listening to
* kede_provider is sentilo provider's id

You can now open the 'mobile.htm' file with any browser and watch live data



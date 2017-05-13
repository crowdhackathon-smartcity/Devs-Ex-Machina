#include <ESP8266WiFi.h>

#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>  

// BTN pin
const uint8_t BTN_PIN = 4;


const uint8_t BTN_INPUT_ID = 122;
const uint8_t BTN_OUTPUT_ID = 123;
const uint16_t BTN_DELAY = 2000;

// If 0 on setup, button is input
// D0 on wemos
const uint8_t PIN_MODE = 16;

// btn_id to submit in request
uint8_t btn_id;

// AP Creds
char ap_name[] = "MagicButton";
char ap_psk[] = "1241234";

// Host creds
// char host_url[] = "example.com";
// char host_port = 80;
char host_url[] = "83.212.123.145";
char host_path[] = "/api/btn?id=";
int host_port = 1880;



void setup()
{
	Serial.begin(115200);

	Serial.println("Starting");

	//
	// Init wifi manager
	// 
	WiFiManager wifi_manager;
	wifi_manager.setAPStaticIPConfig(IPAddress(10,0,0,1), IPAddress(10,0,0,1), IPAddress(255,255,255,0));
	wifi_manager.autoConnect(ap_name, ap_psk);
	Serial.println("Connected!");

	// Set IO
	pinMode(BTN_PIN, INPUT);
	pinMode(PIN_MODE, INPUT);

	// Decide if button is input or output
	if(!digitalRead(PIN_MODE))
	{
		Serial.println("Button is INPUT");
		btn_id = BTN_INPUT_ID;
	}
	else
	{
		Serial.println("Button is OUTPUT");
		btn_id = BTN_OUTPUT_ID;
	}

	// Temp
	pinMode(12, OUTPUT);
}

/************************************************
* Send req
************************************************/
void send_req(String data, char* host, const char* path, int port)
{
	WiFiClient client;

	Serial.printf("Connecting to host %s:%d\n", host, port);
	if(client.connect(host, port))
	{
		Serial.println("Connected to host. Sending req...");

	    Serial.print(data);
	    client.print(data);

        Serial.println("Response:");
	    while(client.connected())
	    {
	    	if(client.available())
	    	{
	        	String line = client.readStringUntil('\n');
	        	Serial.println(line);
	    	}
	    }
	    client.stop();
   		Serial.println("\nConnection closed.");
	}
	else
		Serial.println("Failed to connect client.");

	if(WiFi.status() != WL_CONNECTED)
		Serial.println("Not connected...");
}

/************************************************
* Send button req
************************************************/
void send_btn_press()
{
	String path = host_path + String(btn_id);

	String data = String("GET ") + path + " HTTP/1.1\r\n" +
	                 "Host: " + host_url + "\r\n" +
	                 "Connection: close\r\n"
	                 "\r\n";

	send_req(data, host_url, path.c_str(), host_port);
}

/************************************************
* Get debounced button status
************************************************/
long btn_last_press = 0;
bool get_btn_status()
{
	if(millis() - btn_last_press > BTN_DELAY && digitalRead(BTN_PIN))
	{
		btn_last_press = millis();
		return true;
	}
	else
		return false;
}


void loop()
{
	if(get_btn_status())
	{
		Serial.println("Button press");
		send_btn_press();
	}

	digitalWrite(12, HIGH);
	delay(300);
	digitalWrite(12, LOW);
	delay(300);
}
